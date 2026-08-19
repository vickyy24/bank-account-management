// src/components/common/EmptyState.jsx

const EmptyState = ({ message = "No records found" }) => {

    return (

        <div className="rounded-xl border bg-white px-6 py-12 text-center">

            <h3 className="text-lg font-semibold text-gray-800">
                No Data Found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
                {message}
            </p>

        </div>

    );

};

export default EmptyState;