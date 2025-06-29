// export function generateAttendanceHtmlTemplate(data: { name: string; present: number; absent: number }[]) {
//   const names = data.map((d) => `"${d.name}"`).join(",");
//   const presents = data.map((d) => d.present).join(",");
//   const absents = data.map((d) => d.absent).join(",");

//   return `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Attendance Report</title>
//         <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
//         <style>
//           body { font-family: sans-serif; padding: 20px; }
//           table { width: 100%; border-collapse: collapse; margin-top: 30px; }
//           th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
//           h2 { text-align: center; }
//         </style>
//       </head>
//       <body>
//         <h2>Attendance Report</h2>
//         <canvas id="chart" width="600" height="300"></canvas>
//         <script>
//           const ctx = document.getElementById("chart").getContext("2d");
//           new Chart(ctx, {
//             type: "bar",
//             data: {
//               labels: [${names}],
//               datasets: [
//                 {
//                   label: "Present",
//                   data: [${presents}],
//                   backgroundColor: "rgba(54, 162, 235, 0.7)"
//                 },
//                 {
//                   label: "Absent",
//                   data: [${absents}],
//                   backgroundColor: "rgba(255, 99, 132, 0.7)"
//                 }
//               ]
//             },
//             options: {
//               responsive: false,
//               plugins: { legend: { position: "top" } }
//             }
//           });
//         </script>

//         <table>
//           <thead>
//             <tr><th>Student Name</th><th>Present</th><th>Absent</th></tr>
//           </thead>
//           <tbody>
//             ${data.map(row =>
//               `<tr><td>${row.name}</td><td>${row.present}</td><td>${row.absent}</td></tr>`
//             ).join("")}
//           </tbody>
//         </table>
//       </body>
//     </html>
//   `;
// }


export function generateAttendanceHtmlTemplate(data: { name: string; present: number; absent: number }[]) {
  const labels = data.map(d => d.name);
  const presents = data.map(d => d.present);
  const absents = data.map(d => d.absent);

  const chartConfig = {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Present",
          data: presents,
          backgroundColor: "rgba(54, 162, 235, 0.7)"
        },
        {
          label: "Absent",
          data: absents,
          backgroundColor: "rgba(255, 99, 132, 0.7)"
        }
      ]
    },
    options: {
      plugins: {
        legend: { position: "top" },
        title: { display: true, text: "Attendance Chart" }
      }
    }
  };

  const chartImageUrl = `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Attendance Report</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
          h2 { text-align: center; }
        </style>
      </head>
      <body>
        <h2>Attendance Report</h2>
        <img src="${chartImageUrl}" alt="Attendance Chart" style="width: 100%; max-width: 600px; display: block; margin: 0 auto;" />
        
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Present</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(row =>
              `<tr><td>${row.name}</td><td>${row.present}</td><td>${row.absent}</td></tr>`
            ).join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;
}
