interface InstructionsModalProps {
  onClose: () => void;
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">How to Play Colorfle</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="dark:text-gray-300">Colorfle is a daily color guessing game. Try to guess the secret palette in 6 tries!</p>
          
          <div>
            <h3 className="font-medium mb-2 dark:text-white">Rules:</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Each guess must contain four colors</li>
              <li>The feedback will show how close each color is to the target</li>
              <li>A new palette is available each day</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 dark:text-white">Feedback Colors:</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                <span className="dark:text-gray-300">Green: The color is exactly right</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 rounded-full mr-3"></div>
                <span className="dark:text-gray-300">Yellow: The color is close to the target</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                <span className="dark:text-gray-300">Red: The color is far from the target</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2 dark:text-white">Example:</h3>
            <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
              <div className="flex space-x-2 mb-2">
                <div className="w-10 h-10 rounded" style={{ backgroundColor: "#FF5733" }}></div>
                <div className="w-10 h-10 rounded" style={{ backgroundColor: "#33FF57" }}></div>
                <div className="w-10 h-10 rounded" style={{ backgroundColor: "#3357FF" }}></div>
                <div className="w-10 h-10 rounded" style={{ backgroundColor: "#F3FF33" }}></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-10 h-3 bg-green-500 rounded-full"></div>
                <div className="w-10 h-3 bg-amber-500 rounded-full"></div>
                <div className="w-10 h-3 bg-red-500 rounded-full"></div>
                <div className="w-10 h-3 bg-amber-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-sm mt-2 dark:text-gray-300">In this example, the first color is exactly right, the second and fourth are close, and the third is far off.</p>
          </div>
          
          <div className="border-t dark:border-gray-700 pt-4">
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              Start Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
