"use client";
import { motion } from 'motion/react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { subscriptionData } from '@/app/dashboard/subscriptions/_components/data';
import type { BillingOption, FeatureComparison } from '@/app/dashboard/subscriptions/_components/data';
import { FAQ } from './FAQ';

interface SubscriptionPlansProps {
  className?: string;
}

export function SubscriptionPlans({ className }: SubscriptionPlansProps) {
  const { subscription, billingOptions, features } = subscriptionData;

  const handleSubscribe = (billingOptionId: string) => {
    // TODO: Integrate with payment API
    console.log(`Subscribing to billing option: ${billingOptionId}`);
  };

  return (
    <div className={cn("space-y-8", className)}>
      {/* Subscription Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">{subscription.icon}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {subscription.name}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {subscription.description}
        </p>
      </motion.div>

      {/* Billing Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        {billingOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "relative bg-white rounded-2xl border-2 p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300",
              option.popular
                ? "border-blue-500 scale-105"
                : "border-gray-200 hover:border-blue-300"
            )}
          >
            {/* Popular Badge */}
            {option.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
            )}

            {/* Option Header */}
            <div className="text-center mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{option.name}</h3>
              <p className="text-gray-600 mb-4 md:mb-6 text-sm md:text-base">{option.description}</p>

              {/* Pricing */}
              <div className="mb-4 md:mb-6">
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl md:text-5xl font-bold text-gray-900">
                    ${option.price}
                  </span>
                  <span className="text-gray-600 ml-2 text-sm md:text-base">
                    /{option.period}
                  </span>
                </div>
                {option.originalPrice && (
                  <div className="flex items-center justify-center mt-2">
                    <span className="text-sm text-gray-500 line-through mr-2">
                      ${option.originalPrice}
                    </span>
                    {option.discount && (
                      <span className="text-sm text-green-600 font-medium">
                        Save {option.discount}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
              {option.features.map((feature, featureIndex) => (
                <motion.div
                  key={featureIndex}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="ml-3 text-gray-700 text-sm md:text-base">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <button
              onClick={() => handleSubscribe(option.id)}
              className={cn(
                "w-full py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
                option.popular
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              )}
            >
              {option.ctaText}
            </button>

            {/* Additional Info */}
            {option.additionalInfo && (
              <p className="text-center text-sm text-gray-500 mt-4">
                {option.additionalInfo}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="mt-12 md:mt-16">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 md:mb-8">
          Compare Features
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-left text-sm font-semibold text-gray-900">
                    Features
                  </th>
                  {billingOptions.map((option: BillingOption) => (
                    <th key={option.id} className="px-4 md:px-6 py-3 md:py-4 text-center text-sm font-semibold text-gray-900">
                      {option.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {features.map((feature: FeatureComparison, index: number) => (
                  <motion.tr
                    key={feature.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 md:px-6 py-3 md:py-4 text-sm text-gray-900 font-medium">
                      {feature.name}
                    </td>
                    {billingOptions.map((option: BillingOption) => (
                      <td key={option.id} className="px-4 md:px-6 py-3 md:py-4 text-center">
                        {feature.availability[option.id as keyof typeof feature.availability] === true ? (
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : feature.availability[option.id as keyof typeof feature.availability] === false ? (
                          <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">
                            {feature.availability[option.id as keyof typeof feature.availability]}
                          </span>
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ className="mt-16 md:mt-24" />
    </div>
  );
}
