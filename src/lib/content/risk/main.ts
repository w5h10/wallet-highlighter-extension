import {
	getRiskColor,
	getRiskPercentage,
	getRiskStatus,
	roundToTwo
} from '$lib/content/risk/utils';
import type { RiskDetailItem, RiskTag } from '$lib/types';

export const getRiskDetailUI = (riskDetail: RiskDetailItem, reportStatus = false): string => {
	return `
    <span class="whe-details-button">
      <div class="whe-details-icon">
        ${getIconSvg()}    
      </div>
      <div class="whe-details-element">
        ${getRiskTagContent(riskDetail.tags)}
        <div style="margin-top: 1rem">
         <span class="whe-report-scam-message">Anything fishy about this address?</span> <button id="report-scam" class="whe-report-scam-button" ${
						reportStatus ? 'disabled' : ''
					}>${reportStatus ? 'Already Reported' : 'Report Scam'}</button>
          <table id="whe-risk-details-table-id">
            <tr>
              <td>
                <span class="whe-risk-card">
                  ${getIndividualRiskScoreGuage(riskDetail.combinedRisk)}
                  <span>Combined Risk</span>
                </span>
              </td>
              <td>
                <span class="whe-risk-card">
                  ${getIndividualRiskScoreGuage(riskDetail.fraudRisk)}
                  <span>Fraud Risk</span> 
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="whe-risk-card">
                  ${getIndividualRiskScoreGuage(riskDetail.lendingRisk)}
                  <span>Lending Risk</span> 
                </span>
              </td>
              <td>
                <span class="whe-risk-card">
                  ${getIndividualRiskScoreGuage(riskDetail.reputationRisk)}
                  <span>Reputation Risk</span> 
                </span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </span>`;
};

const getRiskTagContent = (riskTags: RiskTag[]): string => {
	return `
    <div id="whe-risk-tags-container-id">
      <div class="whe-risk-tags">
        ${riskTags
					.map((rt) => {
						return `
              <span
                rel="whe-tooltip"
                whe-tooltip-text="${rt.desc}"
                class="whe-badge">
                ${rt.tag}
              </span>`;
					})
					.join(' ')} 
      </div>
    </div>`;
};

const getIndividualRiskScoreGuage = (scoreStatus: string): string => {
	const score = getRiskPercentage(scoreStatus) ?? 404;
	const riskColour = getRiskColor(roundToTwo(score));
	return `
    <div class="whe-guage-mask">
      <div class="whe-guage-semi-circle" 
          style="background :${riskColour ?? 'initial'}"></div>
      <div class="whe-guage-semi-circle--mask"
          style="transform: rotate(${(score / 100) * 180}deg) translate3d(0, 0, 0);"></div>
    </div>
    <span 
        ${riskColour ? `style="color :${riskColour}"` : ''}>
        ${getRiskStatus(score)}
    </span>`;
};

const getIconSvg = (): string => {
	return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   width="20"
   height="20"
   viewBox="0 0 20 20"
   fill="none"
   version="1.1"
   id="svg58"
   sodipodi:docname="Group 1261156343.svg"
   inkscape:version="1.2.2 (b0a84865, 2022-12-01)"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview60"
     pagecolor="#ffffff"
     bordercolor="#000000"
     borderopacity="0.25"
     inkscape:showpageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="0"
     inkscape:deskcolor="#d1d1d1"
     showgrid="false"
     inkscape:zoom="11.876857"
     inkscape:cx="32.626476"
     inkscape:cy="19.575885"
     inkscape:window-width="1269"
     inkscape:window-height="847"
     inkscape:window-x="1726"
     inkscape:window-y="101"
     inkscape:window-maximized="0"
     inkscape:current-layer="svg58" />
  <rect
     x="0.2864989"
     y="0.2864989"
     width="19.524071"
     height="19.439873"
     rx="3.7325428"
     fill="url(#paint0_linear_470_963)"
     stroke="url(#paint1_linear_470_963)"
     id="rect9"
     style="fill:url(#paint0_linear_470_963);stroke:url(#paint1_linear_470_963);stroke-width:0.572998" />
  <g
     filter="url(#filter0_d_470_963)"
     id="g15"
     transform="matrix(0.59713852,0,0,0.6319414,-0.70513562,-1.6397679)">
    <circle
       cx="18.423201"
       cy="19.056999"
       r="5.2884598"
       fill="#ffffff"
       id="circle11" />
    <path
       d="m 21.7421,18.0669 -4e-4,2e-4 -2.4534,0.981 1.4242,1.9019 z m 0,0 c 0.0991,-0.04 0.1893,-0.0991 0.2655,-0.174 0.0763,-0.0748 0.137,-0.164 0.1787,-0.2623 0.0418,-0.0984 0.0638,-0.204 0.0648,-0.3108 9e-4,-0.1069 -0.0192,-0.2128 -0.0592,-0.3119 l -0.1159,0.0468 0.1159,-0.0468 c -0.04,-0.0991 -0.0991,-0.1893 -0.174,-0.2655 -0.0748,-0.0763 -0.164,-0.137 -0.2623,-0.1787 -0.0984,-0.0418 -0.204,-0.0638 -0.3108,-0.0648 -0.1068,-9e-4 -0.2127,0.0192 -0.3117,0.0591 -10e-5,0 -10e-5,10e-5 -2e-4,10e-5 L 18.8125,17.487 V 15.25 c 0,-0.2155 -0.0856,-0.4221 -0.238,-0.5745 -0.1524,-0.1524 -0.359,-0.238 -0.5745,-0.238 -0.2155,0 -0.4221,0.0856 -0.5745,0.238 -0.1524,0.1524 -0.238,0.359 -0.238,0.5745 v 2.237 l -2.3204,-0.9289 c 0,0 -10e-5,-10e-5 -10e-5,-10e-5 -0.2001,-0.0807 -0.424,-0.0787 -0.6226,0.0057 -0.0983,0.0417 -0.1875,0.1024 -0.2623,0.1787 -0.0749,0.0762 -0.134,0.1664 -0.174,0.2655 -0.04,0.0991 -0.0601,0.205 -0.0592,0.3119 10e-4,0.1068 0.023,0.2124 0.0648,0.3108 0.0843,0.1986 0.2441,0.3555 0.4442,0.4363 l 4e-4,2e-4 2.4558,0.981 -1.4266,1.9019 v 0 c -0.064,0.0854 -0.1106,0.1825 -0.1371,0.2859 -0.0265,0.1033 -0.0323,0.2109 -0.0172,0.3165 0.0151,0.1056 0.0508,0.2073 0.1052,0.2991 0.0543,0.0918 0.1262,0.172 0.2116,0.236 0.0854,0.064 0.1825,0.1106 0.2859,0.1371 0.1033,0.0265 0.2109,0.0323 0.3165,0.0172 0.1056,-0.0151 0.2073,-0.0508 0.2991,-0.1052 0.0918,-0.0543 0.172,-0.1262 0.236,-0.2116 v 0 L 18,20.0414 M 21.7421,18.0669 18,20.0414 m 0,0 1.4125,1.8836 v 0 c 0.1293,0.1724 0.3218,0.2864 0.5351,0.3168 0.2133,0.0305 0.43,-0.025 0.6024,-0.1543 0.1724,-0.1293 0.2864,-0.3218 0.3168,-0.5351 0.0305,-0.2133 -0.025,-0.4299 -0.1542,-0.6023 z m -0.3892,7.3923 -0.0011,-4e-4 C 16.3122,27.0025 9.875,24.4758 9.875,16.863 v -5.0505 c 0,-0.3315 0.1317,-0.6495 0.3661,-0.8839 0.2344,-0.2344 0.5524,-0.3661 0.8839,-0.3661 h 13.75 c 0.3315,0 0.6495,0.1317 0.8839,0.3661 0.2344,0.2344 0.3661,0.5524 0.3661,0.8839 v 5.0497 c 0,7.6127 -6.4355,10.1395 -7.7347,10.5711 l -0.0011,4e-4 c -0.2523,0.0863 -0.5261,0.0863 -0.7784,0 z"
       fill="url(#paint2_angular_470_963)"
       stroke="url(#paint3_linear_470_963)"
       stroke-width="0.249994"
       id="path13"
       style="fill:url(#paint2_angular_470_963);stroke:url(#paint3_linear_470_963)" />
  </g>
  <defs
     id="defs56">
    <filter
       id="filter0_d_470_963"
       x="2.0001199"
       y="4.2500601"
       width="31.9998"
       height="31.9998"
       filterUnits="userSpaceOnUse"
       color-interpolation-filters="sRGB">
      <feFlood
         flood-opacity="0"
         result="BackgroundImageFix"
         id="feFlood17" />
      <feColorMatrix
         in="SourceAlpha"
         type="matrix"
         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
         result="hardAlpha"
         id="feColorMatrix19" />
      <feOffset
         dy="2.24995"
         id="feOffset21" />
      <feGaussianBlur
         stdDeviation="2.49994"
         id="feGaussianBlur23" />
      <feComposite
         in2="hardAlpha"
         operator="out"
         id="feComposite25" />
      <feColorMatrix
         type="matrix"
         values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
         id="feColorMatrix27" />
      <feBlend
         mode="normal"
         in2="BackgroundImageFix"
         result="effect1_dropShadow_470_963"
         id="feBlend29" />
      <feBlend
         mode="normal"
         in="SourceGraphic"
         in2="effect1_dropShadow_470_963"
         result="shape"
         id="feBlend31" />
    </filter>
    <linearGradient
       id="paint0_linear_470_963"
       x1="17.5"
       y1="0"
       x2="17.5"
       y2="35"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.57423736,0,0,0.57176096,-6.1976711e-4,6.184293e-4)">
      <stop
         stop-color="#222024"
         id="stop34" />
      <stop
         offset="1"
         stop-color="#100F11"
         id="stop36" />
    </linearGradient>
    <linearGradient
       id="paint1_linear_470_963"
       x1="17.5"
       y1="0"
       x2="17.5"
       y2="35"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0.57423736,0,0,0.57176096,-6.1976711e-4,6.184293e-4)">
      <stop
         stop-color="#AF7EFF"
         id="stop39" />
      <stop
         offset="1"
         stop-color="#5F1DCC"
         id="stop41" />
    </linearGradient>
    <radialGradient
       id="paint2_angular_470_963"
       cx="0"
       cy="0"
       r="1"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(0,8.59298,-8.25,0,18,19.0305)">
      <stop
         stop-color="white"
         id="stop44" />
      <stop
         offset="0.442708"
         stop-color="#853BFF"
         id="stop46" />
      <stop
         offset="1"
         stop-color="#7F778D"
         id="stop48" />
    </radialGradient>
    <linearGradient
       id="paint3_linear_470_963"
       x1="18"
       y1="10.4375"
       x2="18"
       y2="27.623501"
       gradientUnits="userSpaceOnUse">
      <stop
         stop-color="white"
         stop-opacity="0.56"
         id="stop51" />
      <stop
         offset="1"
         stop-opacity="0"
         id="stop53" />
    </linearGradient>
  </defs>
</svg>
`;
};
