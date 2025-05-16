import { execSync } from "child_process";
import { Octokit } from "octokit";

console.log("[DEPLOY_PREVIEW]: START");
const command = "npm run deploy:staging";
const output = execSync(command, { encoding: "utf8" });
const outputLines = output.split("\n");
const DEPLOY_URL = outputLines[outputLines.length - 1];
console.log("[DEPLOY_PREVIEW]: END");

// ===================================
// ===================================

console.log("[GITHUB_COMMENT]: START");
const {
  GITHUB_TOKEN,
  GITHUB_REPOSITORY_OWNER,
  GITHUB_PR_NUMBER,
  GITHUB_REPOSITORY,
} = process.env;
const GH_COMMENT = `
- Deploy URL TEST: [${DEPLOY_URL}](${DEPLOY_URL})
`;

const defaultHeaders = {};
defaultHeaders["User-Agent"] = `Awesome-Octocat-App`;
defaultHeaders["authorization"] = `token ${GITHUB_TOKEN}`;
defaultHeaders["accept"] =
  "application/vnd.github.v3+json; application/vnd.github.antiope-preview+json";
defaultHeaders["content-type"] = "application/json";
console.log("GITHUB_REPOSITORY_OWNER", GITHUB_REPOSITORY_OWNER);
console.log("GITHUB_PR_NUMBER", GITHUB_PR_NUMBER);
console.log("defaultHeaders", defaultHeaders);
console.log("process.env", process.env);

// new --------------
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

await octokit.request(
  "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
  {
    owner: GITHUB_REPOSITORY_OWNER,
    repo: GITHUB_REPOSITORY.split("/")[1],
    issue_number: GITHUB_PR_NUMBER,
    body: GH_COMMENT,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  },
);
