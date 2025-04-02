'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  // Include initial message with the payment prompt
  const initialMessages = [
    { id: 'initial-1', role: 'assistant', parts: [{ type: 'text', text: 'Hello! Our records show that you currently owe $2400. Are you able to resolve this debt today?' }] },
    ...messages,
  ];

  // State for debt info
  const [totalDebt, setTotalDebt] = useState('2400');
  const [incrementAmount, setIncrementAmount] = useState('2400');
  const [frequency, setFrequency] = useState('One-Time');
  const [estimatedTime, setEstimatedTime] = useState('Immediate');
  const [paymentLink, setPaymentLink] = useState(
    'collectwise.com/payments?termLength=1&totalDebtAmount=2400&termPaymentAmount=2400'
  );

  // Improved parsing of the AI responses to get the latest payment link and frequency
  useEffect(() => {
    let foundLink: string | null = null;
    let foundFrequency: string | null = null;

    // Loop through the initialMessages in reverse order to get the latest payment link and frequency
    for (let i = initialMessages.length - 1; i >= 0; i--) {
      const msg = initialMessages[i];
      if (msg.role === 'assistant') {
        for (const part of msg.parts) {
          if (part.type === 'text') {
            const text = part.text;
            // Try to extract frequency from a summary line if available
            const frequencyMatch = text.match(/Payment Frequency:\s*(Weekly|Bi-Weekly|Monthly)/i);
            if (frequencyMatch) {
              foundFrequency = frequencyMatch[1];
            }
            // Extract the payment link
            const linkMatch = text.match(/collectwise\.com\/payments\?[\w=&]+/);
            if (linkMatch) {
              foundLink = linkMatch[0];
              break; // break on first found link in reverse order
            }
          }
        }
      }
      if (foundLink) break;
    }

    // If a payment link is found, update state from its query parameters
    if (foundLink) {
      setPaymentLink(foundLink);
      const url = new URL('https://' + foundLink);
      const termLength = url.searchParams.get('termLength');
      const debtAmount = url.searchParams.get('totalDebtAmount');
      const termPayment = url.searchParams.get('termPaymentAmount');

      if (debtAmount) setTotalDebt(debtAmount);
      if (termPayment) setIncrementAmount(termPayment);

      // termLength represents the total number of payments
      const paymentCount = termLength ? parseInt(termLength) : 1;

      // If no frequency info was found, default based on paymentCount.
      if (!foundFrequency) {
        foundFrequency = paymentCount === 1 ? "One-Time" : "Monthly";
      }
      setFrequency(foundFrequency);

      // Set estimated completion based on frequency and paymentCount
      if (foundFrequency.toLowerCase() === "weekly") {
        setEstimatedTime(`${paymentCount} week${paymentCount === 1 ? '' : 's'}`);
      } else if (foundFrequency.toLowerCase() === "bi-weekly") {
        // Each payment is two weeks apart
        setEstimatedTime(`${paymentCount * 2} weeks`);
      } else if (foundFrequency.toLowerCase() === "monthly") {
        setEstimatedTime(`${paymentCount} month${paymentCount === 1 ? '' : 's'}`);
      } else if (foundFrequency.toLowerCase() === "one-time") {
        setEstimatedTime("Immediate");
      } else {
        setEstimatedTime(`${paymentCount} payment${paymentCount === 1 ? '' : 's'}`);
      }
    }
  }, [initialMessages]);

  return (
    <div className="flex flex-row w-full h-screen bg-base-200">
      {/* Left Column */}
      <div className="w-1/3 p-6 flex flex-col gap-4">
        {/* Box: Total Debt */}
        <div className="bg-black text-white p-4 rounded">
          <h2 className="font-bold text-lg mb-2">TOTAL DEBT</h2>
          <p className="text-xl">${totalDebt || 'N/A'}</p>
        </div>

        {/* Box: Increment Amount */}
        <div className="bg-black text-white p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Increment Amount</h2>
          <p className="text-xl">
            {incrementAmount ? `$${incrementAmount}` : 'N/A'}
          </p>
        </div>

        {/* Box: Frequency */}
        <div className="bg-black text-white p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Frequency</h2>
          <p className="text-xl">{frequency || 'N/A'}</p>
        </div>

        {/* Box: Estimated Completion */}
        <div className="bg-black text-white p-4 rounded">
          <h2 className="font-bold text-lg mb-2">Estimated Completion</h2>
          <p className="text-xl">{estimatedTime || 'N/A'}</p>
        </div>

        {/* Pay Button */}
        <a
          href={'https://' + paymentLink}
          target="_blank"
          rel="noreferrer"
          className="bg-black text-white p-4 rounded text-center hover:bg-gray-800"
        >
          PAY NOW
        </a>
      </div>

      {/* Right Column (Chat) */}
      <div className="w-2/3 flex flex-col p-6">
        {/* Chat Window */}
        <div className="flex-grow bg-black text-white p-4 rounded overflow-auto">
          <div className="text-center text-xl font-bold mb-4">CHATBOT</div>
          {initialMessages.map((message) => (
            <div key={message.id} className="mb-2 whitespace-pre-wrap">
              <span className="font-bold">
                {message.role === 'user' ? 'User: ' : 'AI: '}
              </span>
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  const text = part.text.replace(/\([^)]*\)/, '');
                  return (
                    <span key={`${message.id}-${i}`} className="ml-1">
                      {text}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        {/* Input Box and Send Button */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex">
            <input
              className="input input-bordered flex-grow mr-2"
              value={input}
              placeholder="Say something..."
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
