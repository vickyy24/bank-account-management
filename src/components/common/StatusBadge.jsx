// src/components/common/StatusBadge.jsx

const StatusBadge = ({ status }) => {

    const isActive =
        String(status).toLowerCase() === "active";

    return (

        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
            }`}
        >
            {status || "Unknown"}
        </span>

    );

};

export default StatusBadge;