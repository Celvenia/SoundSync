import React, { useState } from "react";

export default function Dropdown({ data }) {
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <div>
      <select>
        {data.map((item, i) => (
          <option key={i} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
}
