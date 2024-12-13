export function Privacy() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p>
          Your privacy is important to us. Financial Calculator is designed to
          perform all calculations locally in your browser. We do not collect,
          store, or transmit any of your financial information.
        </p>
        <h2>Data Storage</h2>
        <p>
          All calculations and data are stored locally on your device using your
          browser's local storage. This data never leaves your device and is not
          shared with any third parties.
        </p>
        <h2>Cookies</h2>
        <p>
          We use minimal cookies only for essential functionality, such as
          remembering your theme preference (light/dark mode).
        </p>
        <h2>Contact</h2>
        <p>
          If you have any questions about our privacy policy, please contact us.
        </p>
      </div>
    </div>
  );
}