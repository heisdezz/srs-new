export default function OrderTracking() {
  const orderStatus = [
    { name: "Pending" },
    { name: "Processing" },
    { name: "In Transit" },
    { name: "Delivered" },
  ];

  return (
    <div className="shadow-lg ring fade bg-base-100 rounded-sleek ">
      <h2 className="p-4 border-b fade text-xl font-semibold">
        Order Tracking
      </h2>
      <ul className="steps w-full p-4 justify-between flex">
        {orderStatus.map((step, index) => (
          <li key={step.name} className={`step step-primary  flex-1`}>
            {step.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
