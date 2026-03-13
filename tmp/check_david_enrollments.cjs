const { execSync } = require('child_process');

const args = { studentId: "194156944-3" };
const argsString = JSON.stringify(args);

try {
    const escapedArgs = argsString.replace(/"/g, '\\"');
    const command = `npx convex run debug_David:getStudentEnrollments "${escapedArgs}" --prod`;
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
} catch (error) {
    console.error('Error executing:', error.message);
}
