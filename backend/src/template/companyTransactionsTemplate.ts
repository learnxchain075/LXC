export function generateCompanyTransactionsHtml(
  data: {
    date: Date;
    title: string;
    description: string;
    sourceOrRecipient: string;
    transactionType: string;
    amount: number;
    paymentMode: string;
    billUrl?: string | null;
  }[],
  totals: { income: number; expense: number }
) {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #f0f0f0; }
    </style>
  </head>
  <body>
    <h2>Company Transactions</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Description</th>
          <th>Recipient</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Mode</th>
          <th>Bill</th>
        </tr>
      </thead>
      <tbody>
        ${data
          .map(
            (d) => `
        <tr>
          <td>${new Date(d.date).toLocaleDateString()}</td>
          <td>${d.title}</td>
          <td>${d.description}</td>
          <td>${d.sourceOrRecipient}</td>
          <td>${d.transactionType}</td>
          <td>${d.amount}</td>
          <td>${d.paymentMode}</td>
          <td>${d.billUrl ? "Yes" : "No"}</td>
        </tr>`
          )
          .join("")}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="5"><strong>Total Income</strong></td>
          <td colspan="3">${totals.income}</td>
        </tr>
        <tr>
          <td colspan="5"><strong>Total Expense</strong></td>
          <td colspan="3">${totals.expense}</td>
        </tr>
      </tfoot>
    </table>
  </body>
</html>`;
}
