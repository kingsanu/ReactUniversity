'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  LinkIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { useEvaluationData } from '@/hooks/useEvaluationData';
import { EvaluationSession, Evaluator } from '@/services/evaluationService';

interface EvaluationInvitationsProps {
  sessionId: string;
  onBack?: () => void;
}

interface InvitationStatus {
  evaluatorId: string;
  status: 'pending' | 'sent' | 'opened' | 'completed' | 'expired';
  sentAt?: Date;
  openedAt?: Date;
  completedAt?: Date;
  reminderCount: number;
  lastReminderAt?: Date;
}

interface InvitationTemplate {
  subject: string;
  message: string;
  includeInstructions: boolean;
  reminderEnabled: boolean;
  reminderDays: number;
}

const defaultTemplates: Record<string, InvitationTemplate> = {
  parent: {
    subject: '360° Evaluation Request - Your Input Needed',
    message: `Dear Parent,\n\nYou have been invited to participate in a 360-degree evaluation for your child. Your honest feedback will help provide valuable insights for their personal and academic development.\n\nThis evaluation is confidential and will take approximately 10-15 minutes to complete.\n\nThank you for your participation.`,
    includeInstructions: true,
    reminderEnabled: true,
    reminderDays: 3
  },
  teacher: {
    subject: '360° Evaluation Request - Student Assessment',
    message: `Dear Educator,\n\nYou have been invited to participate in a 360-degree evaluation for one of your students. Your professional perspective is valuable for their development assessment.\n\nThis evaluation is confidential and will take approximately 10-15 minutes to complete.\n\nThank you for your time and input.`,
    includeInstructions: true,
    reminderEnabled: true,
    reminderDays: 5
  },
  peer: {
    subject: '360° Evaluation Request - Peer Assessment',
    message: `Hi there,\n\nYou have been invited to participate in a 360-degree evaluation for a friend/peer. Your honest feedback will help provide insights for their personal development.\n\nThis evaluation is confidential and will take approximately 10-15 minutes to complete.\n\nThanks for helping out!`,
    includeInstructions: true,
    reminderEnabled: true,
    reminderDays: 3
  },
  self: {
    subject: '360° Self-Evaluation - Complete Your Assessment',
    message: `Hello,\n\nPlease complete your self-evaluation as part of your 360-degree assessment. This is an important opportunity for self-reflection and personal development.\n\nThe evaluation will take approximately 15-20 minutes to complete.\n\nThank you.`,
    includeInstructions: true,
    reminderEnabled: true,
    reminderDays: 2
  }
};

const EvaluationInvitations: React.FC<EvaluationInvitationsProps> = ({
  sessionId,
  onBack
}) => {
  const { loadSession, sendInvitations } = useEvaluationData();
  const [session, setSession] = useState<EvaluationSession | null>(null);
  const [evaluators, setEvaluators] = useState<Evaluator[]>([]);
  const [invitationStatuses, setInvitationStatuses] = useState<InvitationStatus[]>([]);
  const [selectedEvaluators, setSelectedEvaluators] = useState<string[]>([]);
  const [customTemplate, setCustomTemplate] = useState<InvitationTemplate>(defaultTemplates.parent);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  useEffect(() => {
    loadInvitationData();
  }, [sessionId]);

  const loadInvitationData = async () => {
    try {
      setLoading(true);
      const sessionData = await loadSession(sessionId);
      
      if (sessionData) {
        setSession(sessionData);
        setEvaluators(sessionData.evaluators);
        
        // Mock invitation statuses for development
        const statuses = sessionData.evaluators.map((evaluator) => ({
          evaluatorId: evaluator.id,
          status: evaluator.invitationSent ? 
            (evaluator.responseReceived ? 'completed' as const : 'sent' as const) : 
            'pending' as const,
          reminderCount: 0,
          sentAt: evaluator.invitationSentAt ? new Date(evaluator.invitationSentAt) : undefined,
          completedAt: evaluator.responseReceivedAt ? new Date(evaluator.responseReceivedAt) : undefined
        }));
        setInvitationStatuses(statuses);
      }
    } catch (error) {
      console.error('Error loading invitation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvitationLink = (evaluator: Evaluator): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const token = btoa(`${evaluator.id}-${sessionId}-${Date.now()}`);
    return `${baseUrl}/evaluation/respond?token=${token}`;
  };

  const getFilteredEvaluators = () => {
    if (selectedGroup === 'all') return evaluators;
    return evaluators.filter(evaluator => evaluator.groupType === selectedGroup);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
      case 'sent':
        return <PaperAirplaneIcon className="w-5 h-5 text-blue-500" />;
      case 'opened':
        return <EnvelopeIcon className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'expired':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Not Sent';
      case 'sent': return 'Sent';
      case 'opened': return 'Opened';
      case 'completed': return 'Completed';
      case 'expired': return 'Expired';
      default: return 'Unknown';
    }
  };

  const handleSendInvitations = async () => {
    if (selectedEvaluators.length === 0) return;
    
    try {
      setSending(true);
      
      for (const evaluatorId of selectedEvaluators) {
        const evaluator = evaluators.find(e => e.id === evaluatorId);
        if (evaluator) {
          const template = defaultTemplates[evaluator.groupType] || customTemplate;
          const invitationLink = generateInvitationLink(evaluator);
          
          await sendInvitations(sessionId, [evaluator.id]);
          
          // Update status
          setInvitationStatuses(prev => 
            prev.map(status => 
              status.evaluatorId === evaluatorId
                ? { ...status, status: 'sent' as const, sentAt: new Date() }
                : status
            )
          );
        }
      }
      
      setSelectedEvaluators([]);
    } catch (error) {
      console.error('Error sending invitations:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSendReminders = async () => {
    const eligibleEvaluators = selectedEvaluators.filter(id => {
      const status = invitationStatuses.find(s => s.evaluatorId === id);
      return status && ['sent', 'opened'].includes(status.status);
    });
    
    if (eligibleEvaluators.length === 0) return;
    
    try {
      setSending(true);
      
      for (const evaluatorId of eligibleEvaluators) {
        const evaluator = evaluators.find(e => e.id === evaluatorId);
        if (evaluator) {
          const template = defaultTemplates[evaluator.groupType] || customTemplate;
          const invitationLink = generateInvitationLink(evaluator);
          
          await sendInvitations(sessionId, [evaluator.id]);
          
          // Update reminder count
          setInvitationStatuses(prev => 
            prev.map(status => 
              status.evaluatorId === evaluatorId
                ? { 
                    ...status, 
                    reminderCount: status.reminderCount + 1,
                    lastReminderAt: new Date()
                  }
                : status
            )
          );
        }
      }
      
      setSelectedEvaluators([]);
    } catch (error) {
      console.error('Error sending reminders:', error);
    } finally {
      setSending(false);
    }
  };

  const copyInvitationLink = async (evaluator: Evaluator) => {
    const link = generateInvitationLink(evaluator);
    try {
      await navigator.clipboard.writeText(link);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const toggleEvaluatorSelection = (evaluatorId: string) => {
    setSelectedEvaluators(prev => 
      prev.includes(evaluatorId)
        ? prev.filter(id => id !== evaluatorId)
        : [...prev, evaluatorId]
    );
  };

  const selectAllFiltered = () => {
    const filteredIds = getFilteredEvaluators().map(e => e.id);
    setSelectedEvaluators(filteredIds);
  };

  const clearSelection = () => {
    setSelectedEvaluators([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Session not found</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  const filteredEvaluators = getFilteredEvaluators();
  const completedCount = invitationStatuses.filter(s => s.status === 'completed').length;
  const sentCount = invitationStatuses.filter(s => ['sent', 'opened', 'completed'].includes(s.status)).length;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Evaluation Invitations</h1>
          <p className="text-gray-600 mt-2">
            Manage invitations for {session.evaluatedPersonName}'s 360° evaluation
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Back
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Total Evaluators</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{evaluators.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Invitations Sent</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{sentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{completedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {evaluators.length > 0 ? Math.round((completedCount / evaluators.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="self">Self</option>
              <option value="parent">Parents</option>
              <option value="teacher">Teachers</option>
              <option value="peer">Peers</option>
            </select>

            {/* Selection Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={selectAllFiltered}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {selectedEvaluators.length} selected
            </span>
            
            <button
              onClick={() => setShowTemplateEditor(!showTemplateEditor)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Edit Template
            </button>
            
            <button
              onClick={handleSendReminders}
              disabled={sending || selectedEvaluators.length === 0}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {sending ? 'Sending...' : 'Send Reminders'}
            </button>
            
            <button
              onClick={handleSendInvitations}
              disabled={sending || selectedEvaluators.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="w-4 h-4" />
              <span>{sending ? 'Sending...' : 'Send Invitations'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Template Editor */}
      {showTemplateEditor && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white p-6 rounded-lg shadow-sm border mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">Email Template</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={customTemplate.subject}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Days
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={customTemplate.reminderDays}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={customTemplate.message}
              onChange={(e) => setCustomTemplate(prev => ({ ...prev, message: e.target.value }))}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={customTemplate.includeInstructions}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, includeInstructions: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Include instructions</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={customTemplate.reminderEnabled}
                onChange={(e) => setCustomTemplate(prev => ({ ...prev, reminderEnabled: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Enable reminders</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Evaluators Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Evaluators ({filteredEvaluators.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEvaluators.length === filteredEvaluators.length && filteredEvaluators.length > 0}
                    onChange={() => {
                      if (selectedEvaluators.length === filteredEvaluators.length) {
                        clearSelection();
                      } else {
                        selectAllFiltered();
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reminders</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvaluators.map((evaluator) => {
                const status = invitationStatuses.find(s => s.evaluatorId === evaluator.id);
                return (
                  <tr key={evaluator.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedEvaluators.includes(evaluator.id)}
                        onChange={() => toggleEvaluatorSelection(evaluator.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {evaluator.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        evaluator.groupType === 'self' ? 'bg-purple-100 text-purple-800' :
                        evaluator.groupType === 'parent' ? 'bg-green-100 text-green-800' :
                        evaluator.groupType === 'teacher' ? 'bg-blue-100 text-blue-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {evaluator.groupType.charAt(0).toUpperCase() + evaluator.groupType.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {evaluator.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(status?.status || 'pending')}
                        <span>{getStatusText(status?.status || 'pending')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {status?.reminderCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => copyInvitationLink(evaluator)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Copy invitation link"
                      >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvaluationInvitations;