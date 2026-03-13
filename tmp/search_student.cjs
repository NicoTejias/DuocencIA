const { execSync } = require('child_process');

const args = { searchTerm: "DAVID NICOLAS" };
const argsString = JSON.stringify(args);

try {
    const escapedArgs = argsString.replace(/"/g, '\\"');
    const command = `npx convex run debug_student:findStudentInWhitelists "${escapedArgs}" --prod`;
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
} catch (error) {
    console.error('Error executing:', error.message);
}
