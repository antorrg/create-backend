import * as readline from "readline";

export const Colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

export const Cursor = {
  hide: "\x1b[?25l",
  show: "\x1b[?25h",
  up: (n = 1) => `\x1b[${n}A`,
  clearLine: "\x1b[2K\x1b[0G",
};

export async function promptInput(
  message: string,
  options?: { validate?: (input: string) => boolean | string; default?: string }
): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultText = options?.default ? ` ${Colors.dim}(${options.default})${Colors.reset}` : "";
  const query = `${Colors.green}?${Colors.reset} ${Colors.bold}${message}${Colors.reset}${defaultText} `;

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(query, (answer: string) => {
        const value = answer.trim() === "" && options?.default ? options.default : answer.trim();

        if (options?.validate) {
          const valid = options.validate(value);
          if (valid !== true) {
            console.log(`${Colors.red}>> ${typeof valid === "string" ? valid : "Invalid input"}${Colors.reset}`);
            ask();
            return;
          }
        }

        rl.close();
        resolve(value);
      });
    };
    ask();
  });
}

export async function promptConfirm(
  message: string,
  options?: { default?: boolean }
): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultText = options?.default !== undefined
    ? options.default ? " (Y/n)" : " (y/N)"
    : " (y/n)";

  const query = `${Colors.green}?${Colors.reset} ${Colors.bold}${message}${Colors.reset}${Colors.dim}${defaultText}${Colors.reset} `;

  return new Promise((resolve) => {
    rl.question(query, (answer: string) => {
      rl.close();
      const val = answer.trim().toLowerCase();
      if (val === "y" || val === "yes" || val === "s" || val === "si") resolve(true);
      else if (val === "n" || val === "no") resolve(false);
      else resolve(options?.default ?? false);
    });
  });
}

export async function promptList<T>(
  message: string,
  choices: { name: string; value: T }[] | T[]
): Promise<T> {
  const parsedChoices = choices.map((c) =>
    typeof c === "object" && c !== null && "value" in c
      ? (c as { name: string; value: T })
      : { name: String(c), value: c as T }
  );

  return new Promise((resolve) => {
    let selectedIndex = 0;
    const cleanup = setupRawMode();

    const render = () => {
      let output = `${Colors.green}?${Colors.reset} ${Colors.bold}${message}${Colors.reset}\n`;
      parsedChoices.forEach((choice, index) => {
        if (index === selectedIndex) {
          output += `${Colors.cyan}❯ ${choice.name}${Colors.reset}\n`;
        } else {
          output += `  ${Colors.dim}${choice.name}${Colors.reset}\n`;
        }
      });
      process.stdout.write(output);
    };

    const clear = () => {
      const lines = parsedChoices.length + 1;
      process.stdout.write(Cursor.up(lines));
      for (let i = 0; i < lines; i++) {
        process.stdout.write(Cursor.clearLine + "\n");
      }
      process.stdout.write(Cursor.up(lines));
    };

    const onKeyPress = (_str: string, key: any) => {
      if (!key) return;

      if (key.name === "up") {
        clear();
        selectedIndex = (selectedIndex - 1 + parsedChoices.length) % parsedChoices.length;
        render();
      } else if (key.name === "down") {
        clear();
        selectedIndex = (selectedIndex + 1) % parsedChoices.length;
        render();
      } else if (key.name === "return") {
        clear();
        cleanup(onKeyPress);
        const selected = parsedChoices[selectedIndex];
        console.log(
          `${Colors.green}?${Colors.reset} ${Colors.bold}${message}${Colors.reset} ${Colors.cyan}${selected.name}${Colors.reset}`
        );
        resolve(selected.value);
      } else if (key.ctrl && key.name === "c") {
        cleanup(onKeyPress);
        console.log(`\n${Colors.yellow}Operation cancelled by user.${Colors.reset}`);
        process.exit(0);
      }
    };

    process.stdout.write(Cursor.hide);
    render();
    process.stdin.on("keypress", onKeyPress);
  });
}

function setupRawMode() {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  return (listener: any) => {
    process.stdin.removeListener("keypress", listener);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    process.stdout.write(Cursor.show);
  };
}
