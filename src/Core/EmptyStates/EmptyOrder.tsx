import { FlexLayout } from "@cedcommerce/ounce-ui";
import React, { ReactElement } from "react";
import { DI } from "../DependencyInjection";

function EmptyOrders(): ReactElement {
  return (
    <FlexLayout
      halign="center"
      valign="center"
      spacing="extraLoose"
      direction="vertical"
    >
      <>
        <svg
          width="150"
          height="150"
          viewBox="0 0 150 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="150" height="150" rx="75" fill="#F5F4FD" />
          <mask
            id="mask0_2436_56"
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="27"
            y="35"
            width="96"
            height="80"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M29.8161 35.5221C29.0955 34.9596 28.0531 35.0651 27.4608 35.771C26.8552 36.4926 26.9494 37.5686 27.671 38.1741L29.8993 40.0438L29.2163 39.8576C28.3074 39.6097 27.3697 40.1455 27.1218 41.0544C26.8739 41.9633 27.4098 42.901 28.3187 43.1489L32.2148 44.2115C34.1219 44.7315 35.7096 46.0531 36.5671 47.8341L37.8264 50.4495L48.3379 88.5011C49.155 91.4588 51.846 93.5073 54.9146 93.5073H93.6145L98.6994 97.7741C97.3721 99.268 96.5658 101.235 96.5658 103.391C96.5658 108.064 100.354 111.851 105.026 111.851C107.713 111.851 110.107 110.599 111.657 108.646L118.742 114.592C119.464 115.197 120.54 115.103 121.145 114.381C121.662 113.765 121.669 112.89 121.211 112.271C121.194 112.258 121.179 112.246 121.163 112.232L30.0917 35.8146C29.9864 35.7263 29.8945 35.6279 29.8161 35.5221ZM113.163 101.066C112.23 97.7959 109.379 95.3343 105.905 94.9758L113.163 101.066ZM104.155 93.5073H106.694C109.762 93.5073 112.453 91.4588 113.27 88.5011L122.033 56.7817C123.233 52.4362 119.964 48.1419 115.456 48.1419H83.7015H50.0901L54.1558 51.5534H83.7015H115.456C117.71 51.5534 119.345 53.7006 118.744 55.8733L109.982 87.5926C109.574 89.0715 108.228 90.0958 106.694 90.0958H100.089L104.155 93.5073ZM99.9773 103.391C99.9773 102.07 100.484 100.868 101.315 99.9684L109.042 106.452C108.119 107.66 106.664 108.44 105.026 108.44C102.238 108.44 99.9773 106.179 99.9773 103.391ZM41.6706 51.5534H43.6158L89.5488 90.0958H54.9146C53.3803 90.0958 52.0348 89.0715 51.6263 87.5926L41.6706 51.5534ZM57.9224 103.391C57.9224 106.179 55.6619 108.44 52.8735 108.44C50.0851 108.44 47.8248 106.179 47.8248 103.391C47.8248 100.603 50.0851 98.3423 52.8735 98.3423C55.6619 98.3423 57.9224 100.603 57.9224 103.391ZM61.3339 103.391C61.3339 108.064 57.5461 111.851 52.8735 111.851C48.2011 111.851 44.4133 108.064 44.4133 103.391C44.4133 98.7185 48.2011 94.9307 52.8735 94.9307C57.5461 94.9307 61.3339 98.7185 61.3339 103.391Z"
              fill="white"
            />
          </mask>
          <g mask="url(#mask0_2436_56)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M29.8161 35.5221C29.0955 34.9596 28.0531 35.0651 27.4608 35.771C26.8552 36.4926 26.9494 37.5686 27.671 38.1741L29.8993 40.0438L29.2163 39.8576C28.3074 39.6097 27.3697 40.1455 27.1218 41.0544C26.8739 41.9633 27.4098 42.901 28.3187 43.1489L32.2148 44.2115C34.1219 44.7315 35.7096 46.0531 36.5671 47.8341L37.8264 50.4495L48.3379 88.5011C49.155 91.4588 51.846 93.5073 54.9146 93.5073H93.6145L98.6994 97.7741C97.3721 99.268 96.5658 101.235 96.5658 103.391C96.5658 108.064 100.354 111.851 105.026 111.851C107.713 111.851 110.107 110.599 111.657 108.646L118.742 114.592C119.464 115.197 120.54 115.103 121.145 114.381C121.662 113.765 121.669 112.89 121.211 112.271C121.194 112.258 121.179 112.246 121.163 112.232L30.0917 35.8146C29.9864 35.7263 29.8945 35.6279 29.8161 35.5221ZM113.163 101.066C112.23 97.7959 109.379 95.3343 105.905 94.9758L113.163 101.066ZM104.155 93.5073H106.694C109.762 93.5073 112.453 91.4588 113.27 88.5011L122.033 56.7817C123.233 52.4362 119.964 48.1419 115.456 48.1419H83.7015H50.0901L54.1558 51.5534H83.7015H115.456C117.71 51.5534 119.345 53.7006 118.744 55.8733L109.982 87.5926C109.574 89.0715 108.228 90.0958 106.694 90.0958H100.089L104.155 93.5073ZM99.9773 103.391C99.9773 102.07 100.484 100.868 101.315 99.9684L109.042 106.452C108.119 107.66 106.664 108.44 105.026 108.44C102.238 108.44 99.9773 106.179 99.9773 103.391ZM41.6706 51.5534H43.6158L89.5488 90.0958H54.9146C53.3803 90.0958 52.0348 89.0715 51.6263 87.5926L41.6706 51.5534ZM57.9224 103.391C57.9224 106.179 55.6619 108.44 52.8735 108.44C50.0851 108.44 47.8248 106.179 47.8248 103.391C47.8248 100.603 50.0851 98.3423 52.8735 98.3423C55.6619 98.3423 57.9224 100.603 57.9224 103.391ZM61.3339 103.391C61.3339 108.064 57.5461 111.851 52.8735 111.851C48.2011 111.851 44.4133 108.064 44.4133 103.391C44.4133 98.7185 48.2011 94.9307 52.8735 94.9307C57.5461 94.9307 61.3339 98.7185 61.3339 103.391Z"
              fill="url(#paint0_linear_2436_56)"
            />
            <path
              d="M29.8161 35.5221L29.8572 35.4916L29.853 35.486L29.8475 35.4817L29.8161 35.5221ZM27.4607 35.771L27.4999 35.8039L27.4607 35.771ZM27.6709 38.1741L27.638 38.2133L27.6709 38.1741ZM29.8992 40.0438L29.8857 40.0932L29.9321 40.0046L29.8992 40.0438ZM29.2162 39.8576L29.2297 39.8082L29.2162 39.8576ZM27.1217 41.0544L27.1711 41.0679L27.1217 41.0544ZM28.3186 43.1489L28.332 43.0995L28.3186 43.1489ZM32.2148 44.2115L32.2282 44.1621L32.2148 44.2115ZM36.5671 47.8342L36.6132 47.8119L36.5671 47.8342ZM37.8263 50.4496L37.8757 50.4359L37.8744 50.4315L37.8724 50.4274L37.8263 50.4496ZM48.3379 88.5011L48.3871 88.4874L48.3379 88.5011ZM93.6145 93.5073L93.6474 93.4681L93.633 93.4561H93.6145V93.5073ZM98.6993 97.7741L98.7377 97.808L98.7727 97.7686L98.7322 97.7349L98.6993 97.7741ZM111.657 108.646L111.69 108.607L111.649 108.573L111.617 108.615L111.657 108.646ZM118.742 114.592L118.709 114.631L118.742 114.592ZM121.145 114.382L121.106 114.349L121.145 114.382ZM121.211 112.271L121.252 112.24L121.247 112.235L121.242 112.231L121.211 112.271ZM121.163 112.232L121.196 112.193L121.163 112.232ZM30.0916 35.8146L30.1245 35.7754L30.0916 35.8146ZM113.163 101.066L113.13 101.106L113.258 101.213L113.212 101.052L113.163 101.066ZM105.905 94.9758L105.91 94.925L105.744 94.9077L105.872 95.015L105.905 94.9758ZM104.155 93.5073L104.122 93.5466L104.136 93.5585H104.155V93.5073ZM113.27 88.5011L113.221 88.4874L113.27 88.5011ZM122.033 56.7817L122.082 56.7953L122.033 56.7817ZM50.09 48.1419V48.0907H49.9495L50.0573 48.1811L50.09 48.1419ZM54.1557 51.5534L54.1229 51.5926L54.1371 51.6046H54.1557V51.5534ZM118.744 55.8734L118.695 55.8597L118.744 55.8734ZM109.982 87.5926L110.031 87.6063L109.982 87.5926ZM100.089 90.0958V90.0446H99.9481L100.056 90.135L100.089 90.0958ZM101.315 99.9684L101.347 99.9292L101.31 99.8978L101.277 99.9338L101.315 99.9684ZM109.041 106.452L109.082 106.483L109.112 106.444L109.074 106.413L109.041 106.452ZM43.6158 51.5534L43.6486 51.5142L43.6344 51.5022H43.6158V51.5534ZM41.6705 51.5534V51.5022H41.6033L41.6212 51.567L41.6705 51.5534ZM89.5488 90.0958V90.147H89.6893L89.5817 90.0566L89.5488 90.0958ZM51.6262 87.5926L51.5767 87.6063L51.6262 87.5926ZM29.8475 35.4817C29.1052 34.9024 28.0316 35.011 27.4215 35.7381L27.4999 35.8039C28.0744 35.1192 29.0855 35.0169 29.7846 35.5624L29.8475 35.4817ZM27.4215 35.7381C26.7978 36.4814 26.8947 37.5896 27.638 38.2133L27.7038 38.1349C27.0038 37.5476 26.9125 36.5039 27.4999 35.8039L27.4215 35.7381ZM27.638 38.2133L29.8663 40.083L29.9321 40.0046L27.7038 38.1349L27.638 38.2133ZM29.9127 39.9945L29.2297 39.8082L29.2027 39.9069L29.8857 40.0932L29.9127 39.9945ZM29.2297 39.8082C28.2935 39.5529 27.3277 40.1048 27.0724 41.0409L27.1711 41.0679C27.4115 40.1863 28.3211 39.6665 29.2027 39.9069L29.2297 39.8082ZM27.0724 41.0409C26.817 41.9771 27.369 42.943 28.3051 43.1983L28.332 43.0995C27.4504 42.8591 26.9307 41.9495 27.1711 41.0679L27.0724 41.0409ZM28.3051 43.1983L32.2013 44.2609L32.2282 44.1621L28.332 43.0995L28.3051 43.1983ZM32.2013 44.2609C34.094 44.777 35.6699 46.0887 36.5209 47.8564L36.6132 47.8119C35.7492 46.0176 34.1495 44.6861 32.2282 44.1621L32.2013 44.2609ZM36.5209 47.8564L37.7802 50.4718L37.8724 50.4274L36.6132 47.8119L36.5209 47.8564ZM37.777 50.4632L48.2884 88.5146L48.3871 88.4874L37.8757 50.4359L37.777 50.4632ZM48.2884 88.5146C49.1116 91.4947 51.8229 93.5585 54.9146 93.5585V93.4561C51.8689 93.4561 49.1981 91.4231 48.3871 88.4874L48.2884 88.5146ZM54.9146 93.5585H93.6145V93.4561H54.9146V93.5585ZM93.5815 93.5466L98.6666 97.8132L98.7322 97.7349L93.6474 93.4681L93.5815 93.5466ZM98.6611 97.74C97.3258 99.2431 96.5146 101.222 96.5146 103.391H96.6169C96.6169 101.248 97.4183 99.2931 98.7377 97.808L98.6611 97.74ZM96.5146 103.391C96.5146 108.092 100.325 111.903 105.026 111.903V111.8C100.382 111.8 96.6169 108.035 96.6169 103.391H96.5146ZM105.026 111.903C107.729 111.903 110.138 110.643 111.697 108.678L111.617 108.615C110.076 110.556 107.697 111.8 105.026 111.8V111.903ZM111.624 108.686L118.709 114.631L118.775 114.553L111.69 108.607L111.624 108.686ZM118.709 114.631C119.452 115.255 120.561 115.158 121.184 114.414L121.106 114.349C120.519 115.049 119.475 115.14 118.775 114.553L118.709 114.631ZM121.184 114.414C121.717 113.78 121.724 112.879 121.252 112.24L121.169 112.301C121.614 112.902 121.607 113.751 121.106 114.349L121.184 114.414ZM121.242 112.231C121.226 112.218 121.211 112.206 121.196 112.193L121.13 112.271C121.146 112.285 121.162 112.298 121.179 112.311L121.242 112.231ZM121.196 112.193L30.1245 35.7754L30.0588 35.8538L121.13 112.271L121.196 112.193ZM30.1245 35.7754C30.0223 35.6897 29.9332 35.5943 29.8572 35.4916L29.7749 35.5525C29.8556 35.6616 29.9503 35.7629 30.0588 35.8538L30.1245 35.7754ZM113.212 101.052C112.274 97.7622 109.406 95.2856 105.91 94.925L105.899 95.0266C109.353 95.383 112.187 97.8297 113.114 101.08L113.212 101.052ZM105.872 95.015L113.13 101.106L113.196 101.027L105.938 94.9366L105.872 95.015ZM104.155 93.5585H106.694V93.4561H104.155V93.5585ZM106.694 93.5585C109.785 93.5585 112.497 91.4947 113.32 88.5146L113.221 88.4874C112.41 91.4231 109.739 93.4561 106.694 93.4561V93.5585ZM113.32 88.5146L122.082 56.7953L121.983 56.768L113.221 88.4874L113.32 88.5146ZM122.082 56.7953C123.291 52.4173 119.998 48.0907 115.456 48.0907V48.1931C119.93 48.1931 123.175 52.4552 121.983 56.768L122.082 56.7953ZM115.456 48.0907H83.7014V48.1931H115.456V48.0907ZM83.7014 48.0907H50.09V48.1931H83.7014V48.0907ZM50.0573 48.1811L54.1229 51.5926L54.1886 51.5142L50.1229 48.1027L50.0573 48.1811ZM54.1557 51.6046H83.7014V51.5022H54.1557V51.6046ZM83.7014 51.6046H115.456V51.5022H83.7014V51.6046ZM115.456 51.6046C117.676 51.6046 119.286 53.7195 118.695 55.8597L118.794 55.8868C119.403 53.6816 117.744 51.5022 115.456 51.5022V51.6046ZM118.695 55.8597L109.933 87.579L110.031 87.6063L118.794 55.8868L118.695 55.8597ZM109.933 87.579C109.53 89.0357 108.205 90.0446 106.694 90.0446V90.147C108.251 90.147 109.617 89.1073 110.031 87.6063L109.933 87.579ZM106.694 90.0446H100.089V90.147H106.694V90.0446ZM100.056 90.135L104.122 93.5466L104.187 93.4681L100.122 90.0566L100.056 90.135ZM101.277 99.9338C100.438 100.843 99.9261 102.057 99.9261 103.391H100.028C100.028 102.084 100.53 100.894 101.352 100.003L101.277 99.9338ZM109.074 106.413L101.347 99.9292L101.282 100.008L109.009 106.491L109.074 106.413ZM105.026 108.491C106.68 108.491 108.15 107.703 109.082 106.483L109.001 106.421C108.088 107.617 106.647 108.389 105.026 108.389V108.491ZM99.9261 103.391C99.9261 106.208 102.209 108.491 105.026 108.491V108.389C102.266 108.389 100.028 106.151 100.028 103.391H99.9261ZM43.6158 51.5022H41.6705V51.6046H43.6158V51.5022ZM89.5817 90.0566L43.6486 51.5142L43.5828 51.5926L89.5159 90.135L89.5817 90.0566ZM54.9146 90.147H89.5488V90.0446H54.9146V90.147ZM51.5767 87.6063C51.9914 89.1073 53.3572 90.147 54.9146 90.147V90.0446C53.4033 90.0446 52.0779 89.0357 51.6755 87.579L51.5767 87.6063ZM41.6212 51.567L51.5767 87.6063L51.6755 87.579L41.7199 51.5398L41.6212 51.567ZM52.8735 108.491C55.6902 108.491 57.9735 106.208 57.9735 103.391H57.8712C57.8712 106.151 55.6335 108.389 52.8735 108.389V108.491ZM47.7736 103.391C47.7736 106.208 50.0569 108.491 52.8735 108.491V108.389C50.1134 108.389 47.8759 106.151 47.8759 103.391H47.7736ZM52.8735 98.2911C50.0569 98.2911 47.7736 100.574 47.7736 103.391H47.8759C47.8759 100.631 50.1134 98.3935 52.8735 98.3935V98.2911ZM57.9735 103.391C57.9735 100.574 55.6902 98.2911 52.8735 98.2911V98.3935C55.6335 98.3935 57.8712 100.631 57.8712 103.391H57.9735ZM52.8735 111.903C57.5742 111.903 61.385 108.092 61.385 103.391H61.2827C61.2827 108.035 57.5177 111.8 52.8735 111.8V111.903ZM44.3621 103.391C44.3621 108.092 48.1727 111.903 52.8735 111.903V111.8C48.2292 111.8 44.4644 108.035 44.4644 103.391H44.3621ZM52.8735 94.8796C48.1727 94.8796 44.3621 98.6903 44.3621 103.391H44.4644C44.4644 98.7469 48.2292 94.9819 52.8735 94.9819V94.8796ZM61.385 103.391C61.385 98.6903 57.5742 94.8796 52.8735 94.8796V94.9819C57.5177 94.9819 61.2827 98.7469 61.2827 103.391H61.385Z"
              fill="url(#paint1_linear_2436_56)"
            />
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_2436_56"
              x1="27.0613"
              y1="44.2089"
              x2="133.213"
              y2="69.9933"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5DD69D" />
              <stop offset="0.273958" stopColor="#6EB7FF" />
              <stop offset="0.508333" stopColor="#FF6E6E" />
              <stop offset="0.747917" stopColor="#FFD86E" />
              <stop offset="1" stopColor="#53BF62" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_2436_56"
              x1="27.0612"
              y1="44.209"
              x2="133.213"
              y2="69.9933"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#5DD69D" />
              <stop offset="0.273958" stopColor="#6EB7FF" />
              <stop offset="0.508333" stopColor="#FF6E6E" />
              <stop offset="0.747917" stopColor="#FFD86E" />
              <stop offset="1" stopColor="#53BF62" />
            </linearGradient>
          </defs>
        </svg>
      </>
      <>
        <h3 className="inte__Heading--Medium   none">No Order(s) Found</h3>
      </>
    </FlexLayout>
  );
}

export default DI(EmptyOrders);