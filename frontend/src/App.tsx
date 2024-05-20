import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";

type Props = {};

const App = (props: Props) => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ModeToggle />
    </ThemeProvider>
  );
};

export default App;
