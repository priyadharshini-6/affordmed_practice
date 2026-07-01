import { useState } from "react";

// ---- Mock Data (would come from backend/API in a real app) ----

const monthlyUsage = {
  January: 320,
  February: 290,
  March: 410,
  April: 260,
};

const currentMonth = "April";
const previousMonth = "March";

const applianceUsage = [
  { name: "Air Conditioner", units: 120 },
  { name: "Refrigerator", units: 60 },
  { name: "Washing Machine", units: 30 },
  { name: "Lighting", units: 25 },
  { name: "Television", units: 15 },
  { name: "Others", units: 10 },
];

const ratePerUnit = 6; // currency units per kWh
const highUsageThreshold = 350;

// ---- Helper ----

function totalUnits(list) {
  return list.reduce((sum, item) => sum + item.units, 0);
}

// ---- Components ----

function AlertBanner({ current, threshold }) {
  if (current <= threshold) return null;

  return (
    <div style={styles.alertBox}>
      <strong>Alert:</strong> Your usage this month ({current} units) is
      higher than usual. Please check the appliance breakdown below.
    </div>
  );
}

function MonthComparison({ months, current, previous }) {
  const maxUnits = Math.max(...Object.values(months));

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Monthly Comparison</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Month</th>
            <th style={styles.th}>Units Used</th>
            <th style={styles.th}>Usage</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(months).map(([month, units]) => (
            <tr key={month}>
              <td style={styles.td}>
                {month}
                {month === current ? " (Current)" : ""}
              </td>
              <td style={styles.td}>{units} kWh</td>
              <td style={styles.td}>
                <div style={styles.barOuter}>
                  <div
                    style={{
                      ...styles.barInner,
                      width: (units / maxUnits) * 100 + "%",
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={styles.note}>
        {months[current] > months[previous]
          ? `You used ${months[current] - months[previous]} more units than last month.`
          : `You used ${months[previous] - months[current]} fewer units than last month.`}
      </p>
    </div>
  );
}

function ApplianceBreakdown({ appliances }) {
  const total = totalUnits(appliances);
  const sorted = [...appliances].sort((a, b) => b.units - a.units);

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Where Your Electricity Is Being Used</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Appliance</th>
            <th style={styles.th}>Units</th>
            <th style={styles.th}>Share</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((item) => {
            const percent = Math.round((item.units / total) * 100);
            return (
              <tr key={item.name}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.units} kWh</td>
                <td style={styles.td}>
                  <div style={styles.barOuter}>
                    <div
                      style={{ ...styles.barInner, width: percent + "%" }}
                    />
                  </div>
                  <span style={styles.percentText}>{percent}%</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={styles.note}>
        Highest consumption: <strong>{sorted[0].name}</strong>
      </p>
    </div>
  );
}

function BillSummary({ units, rate }) {
  const amount = units * rate;

  return (
    <div style={styles.section}>
      <h2 style={styles.heading}>Bill Summary (Current Month)</h2>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.td}>Total Units Consumed</td>
            <td style={styles.td}>{units} kWh</td>
          </tr>
          <tr>
            <td style={styles.td}>Rate per Unit</td>
            <td style={styles.td}>Rs. {rate}</td>
          </tr>
          <tr>
            <td style={styles.td}>
              <strong>Estimated Bill</strong>
            </td>
            <td style={styles.td}>
              <strong>Rs. {amount}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ---- Main App ----

export default function ElectricityDashboard() {
  const [selectedMonth] = useState(currentMonth);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Electricity Usage Dashboard</h1>
      <p style={styles.subtitle}>
        Viewing data for: <strong>{selectedMonth}</strong>
      </p>

      <AlertBanner
        current={monthlyUsage[currentMonth]}
        threshold={highUsageThreshold}
      />

      <MonthComparison
        months={monthlyUsage}
        current={currentMonth}
        previous={previousMonth}
      />

      <ApplianceBreakdown appliances={applianceUsage} />

      <BillSummary units={monthlyUsage[currentMonth]} rate={ratePerUnit} />
    </div>
  );
}

// ---- Styles (black & white only, no animations) ----

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    color: "#000000",
    backgroundColor: "#ffffff",
    padding: "20px",
    maxWidth: "700px",
    margin: "0 auto",
  },
  title: {
    fontSize: "22px",
    borderBottom: "2px solid #000000",
    paddingBottom: "10px",
  },
  subtitle: {
    fontSize: "14px",
    marginBottom: "20px",
  },
  section: {
    marginBottom: "30px",
  },
  heading: {
    fontSize: "16px",
    borderBottom: "1px solid #000000",
    paddingBottom: "5px",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    borderBottom: "1px solid #000000",
    padding: "6px",
    fontSize: "14px",
  },
  td: {
    borderBottom: "1px solid #cccccc",
    padding: "6px",
    fontSize: "14px",
  },
  barOuter: {
    display: "inline-block",
    width: "100px",
    height: "10px",
    border: "1px solid #000000",
    marginRight: "8px",
    verticalAlign: "middle",
  },
  barInner: {
    height: "100%",
    backgroundColor: "#000000",
  },
  percentText: {
    fontSize: "12px",
  },
  note: {
    fontSize: "13px",
    marginTop: "10px",
  },
  alertBox: {
    border: "1px solid #000000",
    padding: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },
};
