# Debt Collector

Debt Collector is a debt payment negotiation chatbot designed to simplify installment plan management. The core functionality is handles variable payment terms such as monthly, weekly, or biweekly. While the UI/UX is kept minimalistic, the focus is on delivering accurate payment term calculations and integrations with the payment system.

## Key Features

- **Dynamic Payment Term Calculation**  
  The application supports variable payment terms (monthly, weekly, or biweekly) based on user input.  
  **Assumption:** The payment link uses the following format:  
  `https://collectwise.com/payments?termLength={termLength}&totalDebtAmount={totalDebtAmount}&termPaymentAmount={termPaymentAmount}`  
  Here, `termLength` represents the **number of payment terms** required to clear the debt—not the frequency (weekly, biweekly, or monthly).

- **Simplistic & Scalable Design**  
  The design is intentionally straightforward to focus on functionality.  
  - DaisyUI is integrated into the codebase, although it is not fully utilized in the current version.  
  - With more time, a phone mockup feature will be implemented using DaisyUI card flows and chat bubbles to enhance the visual experience.
  - Future enhancements include using red to highlight debt amounts and green for the "Pay Now" button to leverage psychological cues.

## Installation

**Clone the repository and set up the project:**
```bash
git clone https://github.com/yourusername/takehome_collectwise.git
cd takehome_collectwise
pnpm install
pnpm run dev
pnpm run build
```

## Future Improvements

- **Enhanced UI/UX:**  
  Utilize DaisyUI's components to create a polished interface with phone mockups, card flows, and chat bubbles.
- **Visual Cues:**  
  Incorporate color psychology by applying red for debt amounts and green for the "Pay Now" button.
- **Responsive Design:**  
  Optimize the layout for both mobile and desktop devices.
