import { home, box, note, setting, bag } from "@cedcommerce/ounce-ui/dist/Icon";
import React from "react";

export const menu = [
  {
    id: "dashboard",
    content: "Dashboard",
    path: "/dashboard",
    icon: home,
  },

  {
    id: "products",
    content: "Products",
    path: "/products",
    icon: note,
  },
  {
    id: "category",
    content: "Collections",
    path: "/category",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M10 7.5H26.25"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 15H26.25"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 22.5H26.25"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 7.5H3.7625"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 15H3.7625"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 22.5H3.7625"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "order",
    content: "Orders",
    path: "/order",
    icon: bag,
    children: [
      {
        id: "Orders",
        content: "Orders",
        path: "/order",
      },
      {
        id: "Shipment",
        content: "Shipments",
        path: "/ship",
      },
    ],
  },
  {
    content: "Transactions",
    id: "transaction",
    path: "/panel/transaction_route",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M15 1.25V28.75"
          stroke="#707070"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.25 6.25H11.875C10.7147 6.25 9.60188 6.71094 8.78141 7.53141C7.96094 8.35188 7.5 9.46468 7.5 10.625C7.5 11.7853 7.96094 12.8981 8.78141 13.7186C9.60188 14.5391 10.7147 15 11.875 15H18.125C19.2853 15 20.3981 15.4609 21.2186 16.2814C22.0391 17.1019 22.5 18.2147 22.5 19.375C22.5 20.5353 22.0391 21.6481 21.2186 22.4686C20.3981 23.2891 19.2853 23.75 18.125 23.75H7.5"
          stroke="#707070"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    children: [
      {
        id: "Pending",
        content: "Pending",
        path: "/transaction/pending",
      },
      {
        id: "Complete",
        content: "Complete",
        path: "/transaction/complete",
      },
    ],
  },
  {
    id: "reports",
    content: "Reports",
    path: "/panel/report",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M5 18.75C5 18.75 6.25 17.5 10 17.5C13.75 17.5 16.25 20 20 20C23.75 20 25 18.75 25 18.75V3.75C25 3.75 23.75 5 20 5C16.25 5 13.75 2.5 10 2.5C6.25 2.5 5 3.75 5 3.75V18.75Z"
          stroke="#707070"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 27.5V18.75"
          stroke="#707070"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    children: [
      {
        id: "order",
        content: "Order",
        path: "/report/order",
      },
      {
        id: "Complete",
        content: "Product",
        path: "/report/product",
      },
    ],
  },
  {
    id: "message",
    content: "Chats",
    path: "/message",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M26.25 14.375C26.2543 16.0249 25.8688 17.6524 25.125 19.125C24.243 20.8897 22.8872 22.374 21.2093 23.4116C19.5314 24.4493 17.5978 24.9993 15.625 25C13.9752 25.0043 12.3476 24.6189 10.875 23.875L3.75 26.25L6.125 19.125C5.38116 17.6524 4.9957 16.0249 5 14.375C5.00076 12.4022 5.55076 10.4686 6.5884 8.79072C7.62603 7.11285 9.11032 5.75699 10.875 4.87504C12.3476 4.1312 13.9752 3.74573 15.625 3.75004H16.25C18.8554 3.89378 21.3163 4.99349 23.1614 6.83861C25.0065 8.68373 26.1063 11.1446 26.25 13.75V14.375Z"
          stroke="#707070"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "subscription",
    content: "Membership",
    path: "/subscription",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="25"
        height="25"
        viewBox="0 0 30 30"
        fill="none"
      >
        <path
          d="M15 18.75C19.8325 18.75 23.75 14.8325 23.75 10C23.75 5.16751 19.8325 1.25 15 1.25C10.1675 1.25 6.25 5.16751 6.25 10C6.25 14.8325 10.1675 18.75 15 18.75Z"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.2625 17.3625L8.75 28.75L15 25L21.25 28.75L19.7375 17.35"
          stroke="#707070"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    children: [
      {
        id: "subscription",
        content: "Subscription",
        path: "/subscription",
      },
      {
        id: "plans",
        content: "Plans",
        path: "/myplans",
      },
    ],
  },

  {
    id: "configuration",
    content: "Configuration",
    path: "/setting",
    icon: setting,
  },
  {
    id: "queuedtasks",
    content: "Activities",
    path: "/log",
    icon: box,
  },
];

export const subMenu = [
  {
    content: "FAQs",
    id: "FAQ",
    path: "/faq",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#707070"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    ),
  },
];
