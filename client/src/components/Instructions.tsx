export default function Instructions() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 mb-6">
      <h3 className="font-medium mb-2 dark:text-white">How to Play</h3>
      <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
        <li className="flex items-start">
          <i className="fas fa-palette text-primary mt-1 mr-2"></i>
          <span>Guess the four colors in today's palette</span>
        </li>
        <li className="flex items-start">
          <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
          <span>Green indicator means the color is correct</span>
        </li>
        <li className="flex items-start">
          <i className="fas fa-dot-circle text-amber-500 mt-1 mr-2"></i>
          <span>Yellow indicator means the color is close</span>
        </li>
        <li className="flex items-start">
          <i className="fas fa-times-circle text-red-500 mt-1 mr-2"></i>
          <span>Red indicator means the color is far off</span>
        </li>
      </ul>
    </div>
  );
}
