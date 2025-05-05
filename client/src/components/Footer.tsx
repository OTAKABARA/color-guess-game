export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 py-4 border-t dark:border-gray-700 mt-auto">
      <div className="max-w-3xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>A color palette guessing game inspired by Colorfle</p>
        <div className="mt-2 flex justify-center space-x-4">
          <a href="#" className="hover:text-primary transition-colors">About</a>
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
