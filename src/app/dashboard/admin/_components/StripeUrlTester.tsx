'use client';

import { useState } from 'react';
import { debugStripeUrls, getSafeStripeUrls } from '@/utils/debugStripeUrls';

export default function StripeUrlTester() {
  const [testResults, setTestResults] = useState<any>(nu);
  const [showTester, setShowTester] = useState(false);

  const runUrlTest = () => {
    try {
      // Test current eent
    ;
;
      
      const results = {
,
        d
        safeUrls,
onment: {
          NODE_ENV: process.env.NODE_ENV,
          NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
         SR)',
          windowLocation:R)'
        }
      };
      
      setTeslts);
    } catch (error) {
      setTestResults({
        success: false,
        error: error instancor',
        environment: {
          NODE_ENV: pro
          NEXT_PUBLIC_
          win',
         
        
    });
    }
  };

  if (!showTester) {
    return (
      <
>
          <div>
            <h3 className="font-medium text-yellow-900 mb-1">
              🔗 Stripe URL Tester
            </h3>
            <p className="-700">
              Test Stripe checkout URL generation to debug paymenssues
            </p>
          </div>
     on
    e)}
text-sm"
          >
            Test URLs
          </button>
div>
      </div>
    );
  }

  return (
    <div cl-6">
      <div className="mb-6">
        <div>
3>
          <p clas
            Debug Stripe checkout URL genn
          </p>
        </dv>
        <button
          onClick={e)}
          clas"
      >
          <svg className4">
            <p/>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <button
          onCli
          c"
        >
          Run UR
        </>

        {testResults && (
          <div className="mt-6">
            <h4 className="font-medium mb-3">Test Results:</h4>
            
            {testResults.success ? (
              <div
                
          
            700">
          p>
    >
 }</p>

}v>
  );v>
    </di</di    
    </div>     /div>
         <
  </ul>   
         ble</li>s accessient URL iyour deploym<li>Verify        li>
       col</to/ proudes https:/ inclthe domainure  <li>Make s            /li>
 ectly<set corrBASE_URL is UBLIC_API_e NEXT_Pur     <li>Ens         tion)</li>
produchost for t localr domain (no on a propee runningat you'rk th <li>Chec            
 ">y-1 space-inside ml-4disc list-list-sName="l clas    <u      >
  strong></pvalid:</s are inRLg>If U   <p><stron         -2">
700 space-ytext-blue-sm Name="text-v class     <di5>
     Fixes</hick ">💡 Que-800 mb-2lutext-bont-medium e="fssNam    <h5 cla      ">
lgounded-blue-200 rrder border-e-50 bo4 bg-blu"mt-6 p-e=div classNam}
        < Fixes */* Quick
        {/}
       )  </div>
 
                )}ails>
    et     </d
               </pre>          l, 2)}
ul, nInfos.debuglttestResuingify(   {JSON.str       ">
        autoow-x-fl overmt-2-700 luetext-bext-xs ="te className      <pr
          s</summary>ebug Detailpointer">Drsor-0 cue-80ext-blu tediumont-mme="fclassNammary      <su          >
 d-lg" rounder-blue-200border borde-50 g-blue b"p-4e=lassNamls ctai     <de   && (
      fo .debugIntResultstes         {/}
    Info */* Debug    {

        iv></d       div>
            </    }</p>
   ndowLocation.wiironmentesults.envtestRong> {</str Location:rentstrong>Cur     <p><       
    Origin}</p>nment.windownviroResults.e {testin:</strong>rigindow O><strong>W <p        
       p>ot set'}</E_URL || 'NBLIC_API_BASent.NEXT_PUronmenviResults.testong> {trURL:</s_BASE__PUBLIC_APIong>NEXTp><str  <            /p>
  ODE_ENV}<ronment.Nvits.en{testResulV:</strong> g>NODE_ENtron    <p><s            -y-1">
00 spaceray-6xt-sm text-g"tesName=  <div clas       5>
     t Info</hronmen">Envi00 mb-2t-gray-8text-medium ame="fon<h5 classN              -lg">
roundedr-gray-200 rdeborder g-gray-50 boe="p-4 blassNam  <div c        /}
  ment Info * Environ     {/*
          )}

         div> </         /p>
    s.error}<ult">{testResext-red-700-sm txte="te<p classNam               ed</h5>
 on FailRL Generatib-2">❌ U00 mm text-red-8"font-mediuame=lassN       <h5 c      
   g">00 rounded-l-red-2erorder bordg-red-50 b4 bName="p-class     <div    
         ) : (         div>
    </         div>
     </          iv>
   </d                 