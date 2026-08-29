export default function PageContainer({ children, className = '' }) {
    return <div className={`page-container px-4 sm:px-6 lg:px-8 py-6 lg:py-8 ${className}`}>{children}</div>;
}
