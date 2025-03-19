// const CarCard = ({
//   active,
//   image,
//   tags,
//   brand,
//   model,
//   number,
//   date,
//   color,
// }) => {
//   return (
//     <div
//       className={`rounded-2xl border bg-white p-4 shadow-lg ${
//         active ? "border-green-300" : ""
//       }`}
//     >
//       <img
//         src={image}
//         alt="Car"
//         className="h-32 w-full rounded-md object-cover"
//       />
//       <div className="mt-3">
//         <h3 className="text-lg font-semibold">Tags</h3>
//         <div className="mt-1 flex gap-2">
//           {tags.map((tag, index) => (
//             <span
//               key={index}
//               className={`rounded-full px-3 py-1 text-sm ${
//                 tag === "Approved"
//                   ? "bg-teal-100 text-teal-700"
//                   : "bg-purple-100 text-purple-700"
//               }`}
//             >
//               {tag}
//             </span>
//           ))}
//         </div>
//       </div>
//       <div className="mt-3 border-t pt-3 text-sm text-gray-700">
//         <p>
//           <strong>Vehicle Make / Brand Name:</strong> {brand}
//         </p>
//         <p>
//           <strong>Vehicle Model No:</strong> {model}
//         </p>
//         <p>
//           <strong>Vehicle Number:</strong> {number}
//         </p>
//         <p>
//           <strong>Create Date:</strong> {date}
//         </p>
//         <p>
//           <strong>Other Info:</strong> COLOR: {color}
//         </p>
//       </div>
//     </div>
//   );
// };
