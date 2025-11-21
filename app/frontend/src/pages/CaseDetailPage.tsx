import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {api} from "../lib/api";

export default function CaseDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await api.get(`/cases/${id}`);
    setData(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">
        Case {data.case_id}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-2">Applicant Details</h2>

        <p><strong>Name:</strong> {data.applicant_name}</p>
        <p><strong>DOB:</strong> {data.dob}</p>
        <p><strong>Email:</strong> {data.email || "N/A"}</p>
        <p><strong>Phone:</strong> {data.phone || "N/A"}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">History</h2>

        <ul className="space-y-3">
          {data.audit_logs.map((log: any) => (
            <li
              key={log.id}
              className="border-l-4 border-blue-600 pl-4 py-2 bg-gray-50 rounded"
            >
              <p className="font-medium">{log.action}</p>
              <p className="text-sm text-gray-600">{log.timestamp}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
