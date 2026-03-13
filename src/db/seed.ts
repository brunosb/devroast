import { faker } from "@faker-js/faker";
import { db } from "./index";
import { issues, roasts, stats } from "./schema";

const TOTAL_ROASTS = 100;

const languages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
  "rust",
  "ruby",
  "php",
  "c",
  "csharp",
];

const codeSnippets: Record<string, string[]> = {
  javascript: [
    `var x = 1;\nif (x == true) {\n  console.log("yes");\n}`,
    `function add(a, b) {\n  return eval(a + "+" + b);\n}`,
    `document.write("<h1>" + userInput + "</h1>");`,
    `for (var i = 0; i < arr.length; i++) {\n  setTimeout(function() {\n    console.log(arr[i]);\n  }, 1000);\n}`,
    `let data = JSON.parse(JSON.stringify(bigObject));`,
  ],
  typescript: [
    `const x: any = fetchData();\nconsole.log(x.foo.bar.baz);`,
    `function parse(input: string): any {\n  return JSON.parse(input) as any;\n}`,
    `// @ts-ignore\nconst result = dangerousOperation();`,
    `type User = { name: string; age: number };\nconst u = {} as User;`,
    `export const handler = async (req: any, res: any) => {\n  res.send(req.body);\n};`,
  ],
  python: [
    `import os\nos.system(input("Enter command: "))`,
    `def add(a, b):\n  return eval(f"{a}+{b}")`,
    `password = "admin123"\nif user_input == password:\n  grant_access()`,
    `try:\n  do_something()\nexcept:\n  pass`,
    `from time import sleep\nwhile True:\n  sleep(0)`,
  ],
  java: [
    `public void process(String input) {\n  Runtime.getRuntime().exec(input);\n}`,
    `catch (Exception e) {\n  // TODO: handle later\n}`,
    `String query = "SELECT * FROM users WHERE id=" + userId;`,
    `public static Object data = null;\npublic static void set(Object d) { data = d; }`,
    `if (str == "hello") {\n  System.out.println("match");\n}`,
  ],
  go: [
    `func handler(w http.ResponseWriter, r *http.Request) {\n  body, _ := io.ReadAll(r.Body)\n  fmt.Fprintf(w, string(body))\n}`,
    `func divide(a, b int) int {\n  return a / b\n}`,
    `var mu sync.Mutex\nfunc update() {\n  data++\n}`,
  ],
  rust: [
    `fn main() {\n  let x: i32 = "hello".parse().unwrap();\n  println!("{}", x);\n}`,
    `unsafe {\n  let ptr = 0x1234 as *mut i32;\n  *ptr = 42;\n}`,
    `fn process(input: &str) {\n  let _ = std::process::Command::new(input).output();\n}`,
  ],
  ruby: [
    `eval(params[:code])`,
    `def login(user, pass)\n  if pass == "password123"\n    true\n  end\nend`,
    `system("rm -rf #{user_input}")`,
  ],
  php: [
    `<?php\n$query = "SELECT * FROM users WHERE id=" . $_GET['id'];\nmysqli_query($conn, $query);`,
    `<?php eval($_POST['code']); ?>`,
    `<?php\n$password = md5($input);\nif ($password == $stored) { login(); }`,
  ],
  c: [
    `void copy(char *input) {\n  char buf[16];\n  strcpy(buf, input);\n}`,
    `int main() {\n  int *p;\n  printf("%d", *p);\n  return 0;\n}`,
    `char* getName() {\n  char name[64];\n  gets(name);\n  return name;\n}`,
  ],
  csharp: [
    `public void Run(string cmd) {\n  Process.Start("cmd.exe", "/c " + cmd);\n}`,
    `var query = "SELECT * FROM Users WHERE Id=" + id;\ncommand.CommandText = query;`,
    `catch (Exception) {\n  // swallow\n}`,
  ],
};

const issueTitles: Record<string, { title: string; description: string }[]> = {
  critical: [
    {
      title: "SQL injection vulnerability",
      description:
        "String concatenation in SQL queries allows attackers to inject malicious SQL. Use parameterized queries instead.",
    },
    {
      title: "command injection via user input",
      description:
        "Executing shell commands with unsanitized user input. An attacker could run arbitrary commands on your server.",
    },
    {
      title: "eval() with untrusted data",
      description:
        "Using eval() on user-provided input is one of the most dangerous patterns. It allows arbitrary code execution.",
    },
    {
      title: "hardcoded credentials",
      description:
        "Passwords and secrets should never be hardcoded. Use environment variables or a secret manager.",
    },
    {
      title: "XSS via innerHTML/document.write",
      description:
        "Injecting user input directly into the DOM without sanitization allows cross-site scripting attacks.",
    },
    {
      title: "buffer overflow risk",
      description:
        "Using unsafe string copy functions without bounds checking. Use strncpy or safer alternatives.",
    },
  ],
  warning: [
    {
      title: "using var instead of const/let",
      description:
        "var is function-scoped and leads to hoisting bugs. Use const by default, let when reassignment is needed.",
    },
    {
      title: "empty catch block",
      description:
        "Swallowing exceptions silently makes debugging impossible. At minimum, log the error.",
    },
    {
      title: "== instead of ===",
      description:
        "Loose equality can cause unexpected type coercion. Always use strict equality (===) unless you have a specific reason.",
    },
    {
      title: "no error handling",
      description:
        "Ignoring potential errors will cause silent failures. Handle errors explicitly or let them propagate.",
    },
    {
      title: "mutation of shared state",
      description:
        "Modifying shared/global state without synchronization leads to race conditions and unpredictable behavior.",
    },
    {
      title: "deep clone via JSON serialize",
      description:
        "JSON.parse(JSON.stringify()) drops functions, undefined values, and circular references. Use structuredClone() or a proper deep clone utility.",
    },
  ],
  good: [
    {
      title: "readable variable naming",
      description:
        "Variable names are descriptive and follow conventions. Keep it up.",
    },
    {
      title: "consistent indentation",
      description: "Code indentation is consistent throughout. Good habit.",
    },
    {
      title: "proper use of type annotations",
      description:
        "Types help catch bugs at compile time. This code uses them well.",
    },
  ],
};

const roastTexts = [
  "this code was written during a power outage... in 2005.",
  "I've seen better code in a CAPTCHA.",
  "this is what happens when Stack Overflow is down.",
  "even ChatGPT would refuse to generate this.",
  "the only thing this code handles well is crashing.",
  "this code has more red flags than a communist parade.",
  "I'd rather debug assembly than read this.",
  "your code is the reason we have code reviews.",
  "this is not code, this is a cry for help.",
  "if spaghetti code was an art form, you'd be Picasso.",
  "the person who wrote this should be banned from all IDEs.",
  "this code violates the Geneva Convention.",
  "somewhere, a senior developer is crying.",
  "this is what AI will use as a negative example.",
  "you didn't write code, you wrote a liability.",
  "honestly? not the worst I've seen today. but close.",
  "this code is so clean it's suspicious.",
  "surprisingly competent. are you sure you wrote this?",
  "this works? I mean... it works. wow.",
  "actually decent. the bar was low but you cleared it.",
];

function getVerdict(score: number) {
  if (score < 2) return "disaster" as const;
  if (score < 4) return "needs_serious_help" as const;
  if (score < 6) return "not_great" as const;
  if (score < 8) return "acceptable" as const;
  return "clean_code" as const;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIssuesForRoast(score: number) {
  const count =
    score < 3
      ? faker.number.int({ min: 3, max: 5 })
      : score < 6
        ? faker.number.int({ min: 2, max: 4 })
        : faker.number.int({ min: 1, max: 2 });

  const result: {
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }[] = [];
  const usedTitles = new Set<string>();

  for (let i = 0; i < count; i++) {
    let severity: "critical" | "warning" | "good";
    if (score < 3) severity = i < 2 ? "critical" : "warning";
    else if (score < 6) severity = i === 0 ? "critical" : "warning";
    else severity = i === 0 ? "warning" : "good";

    const pool = issueTitles[severity];
    let issue = pickRandom(pool);
    let attempts = 0;
    while (usedTitles.has(issue.title) && attempts < 10) {
      issue = pickRandom(pool);
      attempts++;
    }
    usedTitles.add(issue.title);
    result.push({ severity, ...issue });
  }

  return result;
}

async function seed() {
  console.log("🌱 Seeding database...");

  let totalScore = 0;

  for (let i = 0; i < TOTAL_ROASTS; i++) {
    const language = pickRandom(languages);
    const snippets = codeSnippets[language] ?? codeSnippets.javascript;
    const code = pickRandom(snippets);
    const lineCount = code.split("\n").length;
    const score =
      Math.round(
        faker.number.float({ min: 0.5, max: 9.8, fractionDigits: 1 }) * 10,
      ) / 10;
    const verdict = getVerdict(score);
    const brutalMode = faker.datatype.boolean({ probability: 0.4 });

    totalScore += score;

    const [inserted] = await db
      .insert(roasts)
      .values({
        code,
        language,
        lineCount,
        brutalMode,
        score,
        verdict,
        roastText: pickRandom(roastTexts),
        diff: null,
        createdAt: faker.date.recent({ days: 90 }),
      })
      .returning({ id: roasts.id });

    const roastIssues = generateIssuesForRoast(score);

    if (roastIssues.length > 0) {
      await db.insert(issues).values(
        roastIssues.map((issue) => ({
          roastId: inserted.id,
          severity: issue.severity,
          title: issue.title,
          description: issue.description,
        })),
      );
    }

    if ((i + 1) % 25 === 0) {
      console.log(`  ✓ ${i + 1}/${TOTAL_ROASTS} roasts created`);
    }
  }

  const avgScore = Math.round((totalScore / TOTAL_ROASTS) * 10) / 10;

  await db.insert(stats).values({
    id: 1,
    totalRoasts: TOTAL_ROASTS,
    avgScore,
  });

  console.log(
    `\n✅ Seed complete: ${TOTAL_ROASTS} roasts, avg score: ${avgScore}`,
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
