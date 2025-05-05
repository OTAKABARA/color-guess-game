import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { useSettings } from "./context/SettingsContext";

export default function App() {
  const { settings } = useSettings();
  
  return (
    <div className={settings.darkMode ? "dark" : ""}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
