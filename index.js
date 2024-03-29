const inquirer = require('inquirer');
const mysql = require('mysql2');

class EmployeeTrackerActions {
    constructor(connection) {
        this.connection = connection;
    }

    viewAllEmployees() {
        this.connection.query('SELECT * FROM employee', (err, res) => {
            if (err) throw err;
            console.table(res);
            startApp();
        });
    }

    viewAllDepartments() {
        this.connection.query('SELECT * FROM department', (err, res) => {
            if (err) throw err;
            console.table(res);
            startApp();
        });
    }

    viewAllRoles() {
        this.connection.query('SELECT * FROM role', (err, res) => {
            if (err) throw err;
            console.table(res);
            startApp();
        });
    }

    addDepartment() {
        inquirer.prompt({
            name: 'departmentName',
            type: 'input',
            message: 'What is the name of the new department?'
        })
        .then(answer => {
            connection.query('INSERT INTO department (name) VALUES (?)', answer.departmentName, (err, res) => {
                if (err) throw err;
                console.log(`Added ${answer.departmentName} to departments.`);
                startApp();
            });
        });
    }

    addRole() {
        connection.query('SELECT id, name FROM department', (err, departments) => {
            if (err) throw err;
    
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'title',
                    type: 'input',
                    message: 'What is the title of the new role?'
                },
                {
                    name: 'salary',
                    type: 'input',
                    message: 'What is the salary for this role?',
                    validate: value => !isNaN(value) || 'Please enter a number'
                },
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Which department does this role belong to?',
                    choices: departmentChoices
                }
            ])
            .then(answers => {
                connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
                    [answers.title, answers.salary, answers.departmentId],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${answers.title} to roles.`);
                        startApp();
                    }
                );
            });
        });
    }

    addEmployee() {
        connection.query('SELECT id, title FROM role', (err, roles) => {
            if (err) throw err;
    
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'firstName',
                    type: 'input',
                    message: 'What is the first name of the employee?'
                },
                {
                    name: 'lastName',
                    type: 'input',
                    message: 'What is the last name of the employee?'
                },
                {
                    name: 'roleId',
                    type: 'list',
                    message: 'What is the role of the employee?',
                    choices: roleChoices
                }
            ])
            .then(answers => {
                connection.query('INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)',
                    [answers.firstName, answers.lastName, answers.roleId],
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Added ${answers.firstName} ${answers.lastName} to employees.`);
                        startApp();
                    }
                );
            });
        });
    }

    updateEmployeeManager() {
        connection.query('SELECT id, first_name, last_name FROM employee', (err, employees) => {
            if (err) throw err;
    
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'employeeId',
                    type: 'list',
                    message: 'Which employee\'s manager do you want to update?',
                    choices: employeeChoices
                },
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Who is the new manager?',
                    choices: employeeChoices
                }
            ])
            .then(answers => {
                connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [answers.managerId, answers.employeeId], err => {
                    if (err) throw err;
                    console.log('Updated employee\'s manager.');
                    startApp();
                });
            });
        });
    }
    

    viewEmployeesByManager() {
        connection.query('SELECT id, first_name, last_name FROM employee WHERE manager_id IS NOT NULL', (err, managers) => {
            if (err) throw err;
    
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'managerId',
                    type: 'list',
                    message: 'Select a manager to view their employees:',
                    choices: managerChoices
                }
            ])
            .then(answer => {
                connection.query('SELECT first_name, last_name FROM employee WHERE manager_id = ?', answer.managerId, (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    startApp();
                });
            });
        });
    }
    viewEmployeesByDepartment() {
        connection.query('SELECT id, name FROM department', (err, departments) => {
            if (err) throw err;
    
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Select a department:',
                    choices: departmentChoices
                }
            ])
            .then(answer => {
                connection.query(
                    'SELECT employee.first_name, employee.last_name FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ?', 
                    answer.departmentId, 
                    (err, res) => {
                        if (err) throw err;
                        console.table(res);
                        startApp();
                    }
                );
            });
        });
    }

    deleteDepartment() {
        connection.query('SELECT id, name FROM department', (err, departments) => {
            if (err) throw err;
    
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Select a department to delete:',
                    choices: departmentChoices
                }
            ])
            .then(answer => {
                connection.query('DELETE FROM department WHERE id = ?', answer.departmentId, err => {
                    if (err) throw err;
                    console.log('Department deleted.');
                    startApp();
                });
            });
        });
    }

    viewDepartmentBudget() {
        connection.query('SELECT id, name FROM department', (err, departments) => {
            if (err) throw err;
    
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
    
            inquirer.prompt([
                {
                    name: 'departmentId',
                    type: 'list',
                    message: 'Select a department to view its utilized budget:',
                    choices: departmentChoices
                }
            ])
            .then(answer => {
                connection.query(
                    'SELECT SUM(salary) AS utilized_budget FROM role JOIN employee ON role.id = employee.role_id WHERE department_id = ?', 
                    answer.departmentId, 
                    (err, res) => {
                        if (err) throw err;
                        console.log(`Total Utilized Budget: ${res[0].utilized_budget}`);
                        startApp();
                    }
                );
            });
        });
    }
    
}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employee_tracker'
});

connection.connect(err => {
    if (err) throw err;
    console.log('Connected as id ' + connection.threadId);
    startApp();
});

function startApp() {
    const trackerActions = new EmployeeTrackerActions(connection);

    inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'viewAllEmployees',
            'viewAllDepartments',
            'viewAllRoles',
            'addDepartment',
            'addRole',
            'addEmployee',
            'updateEmployeeManager',
            'viewEmployeesByManager',
            'viewEmployeesByDepartment',
            'deleteDepartment',
            'viewDepartmentBudget',
            'Exit'
        ]
    })
    .then(answer => {
        if (answer.action in trackerActions) {
            trackerActions[answer.action]();
        } else if (answer.action === 'Exit') {
            connection.end();
        } else {
            console.log('Action not recognized.');
            startApp();
        }
    });
}