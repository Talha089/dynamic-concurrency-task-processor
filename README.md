# NodeJS Coding Problem

This project is a JavaScript-based task processor that handles tasks with a dynamic concurrency limit. The concurrency level adjusts on the fly based on the time of day, enabling different levels of parallel task execution during business hours and off-hours. The processor continuously monitors the current concurrency level and dynamically adjusts the number of tasks being processed concurrently.

## Features

- **Dynamic Concurrency Adjustment**: Automatically adjusts concurrency based on time of day, with lower concurrency during business hours (9 AM - 5 PM) and higher concurrency outside those hours.
- **Real-Time Concurrency Monitoring**: Concurrency level changes are monitored every few seconds and updated dynamically without interrupting ongoing tasks.
- **Randomized Task Simulation**: Each task takes a random amount of time to complete, simulating real-world asynchronous operations.

## Requirements

- Node.js (for running the JavaScript code)
- Console environment (to view task logs)

## Getting Started

### 1. Clone the Repository

```bash
git clone ###
```

### 2. Run the Program

```bash
node index.js
```

### 3. Expected Output

The program will output logs to the console, displaying:
- The current task count and concurrency level.
- Each task’s start and completion time.
- Any changes in the concurrency level as they happen in real time.

Example output:

```
[init] Concurrency Algo Testing...
[init] Tasks to process: 20
[init] Task list: <List of randomly generated task names>
[init] Initial Concurrency Level: 4

[EXEC] Task count: 1 of 20
[EXEC] Starting: abcdefg
[EXEC] Concurrency: 1 of 4

[TASK] FINISHED: abcdefg in 132ms

[INFO] Concurrency level changed from 4 to 20
...
[init] All tasks completed!
```

## Code Explanation

### Task List

A list of tasks is generated with random alphanumeric strings as task names:

```javascript
const numberOfTasks = 20;
const taskList = [...Array(numberOfTasks)].map(() => 
    [...Array(~~(Math.random() * 10 + 3))]
        .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
        .join('')
);
```

### Task Execution

Each task is simulated using `doTask(taskName)`, which resolves after a random delay:

```javascript
function doTask(taskName) {
    return new Promise((resolve) => {
        const begin = Date.now();
        setTimeout(() => {
            const end = Date.now();
            const timeSpent = (end - begin) + "ms";
            console.log(`[TASK] FINISHED: ${taskName} in ${timeSpent}`);
            resolve(true);
        }, Math.random() * 200);
    });
}
```

### Concurrency Management

The concurrency level is determined based on the time of day. During business hours (9 AM to 5 PM), it is set to 4, and outside these hours, it is set to 20.

```javascript
function getConcurrencyLimit() {
    const currentHour = new Date().getHours();
    return (currentHour >= 9 && currentHour < 17) ? 4 : 20;
}
```

### Dynamic Concurrency Monitoring

The `monitorConcurrency()` function checks for changes in the concurrency limit every 5 seconds and updates the `maxConcurrency` variable if needed:

```javascript
function monitorConcurrency() {
    setInterval(() => {
        const newConcurrency = getConcurrencyLimit();
        if (newConcurrency !== maxConcurrency) {
            console.log(`[INFO] Concurrency level changed from ${maxConcurrency} to ${newConcurrency}`);
            maxConcurrency = newConcurrency;
        }
    }, 5000);
}
```

### Task Processing

The `manageConcurrency(taskList)` function starts and manages tasks according to the current concurrency limit, automatically adjusting when `maxConcurrency` changes:

```javascript
async function manageConcurrency(taskList) {
    let activeTasks = 0;
    let taskIndex = 0;

    return new Promise((resolve) => {
        const processNextTask = () => {
            if (taskIndex >= taskList.length && activeTasks === 0) {
                resolve();
                return;
            }

            while (activeTasks < maxConcurrency && taskIndex < taskList.length) {
                const currentTask = taskList[taskIndex++];
                activeTasks++;
                console.log(`[EXEC] Task count: ${taskIndex} of ${taskList.length}`);
                console.log(`[EXEC] Starting: ${currentTask}`);
                console.log(`[EXEC] Concurrency: ${activeTasks} of ${maxConcurrency}\n`);
                doTask(currentTask)
                    .then(() => {
                        activeTasks--;
                        processNextTask();
                    });
            }
        };
        processNextTask();
    });
}
```

### Initialization

The `init()` function initializes the task processing, sets the initial concurrency level, and starts monitoring for concurrency level changes.

```javascript
async function init() {
    console.log("[init] Concurrency Algo Testing...");
    console.log("[init] Tasks to process:", taskList.length);
    console.log("[init] Task list:", taskList.join(', '));
    console.log("[init] Initial Concurrency Level:", maxConcurrency);

    monitorConcurrency(); // Start monitoring concurrency changes
    await manageConcurrency(taskList);
    console.log("[init] All tasks completed!");
}
```

## Configuration

To modify concurrency settings, you can change the values in the `getConcurrencyLimit()` function:
- Business hours limit (e.g., 4)
- Off-hours limit (e.g., 20)

You can also change the `monitorConcurrency()` interval to check for concurrency level updates at different frequencies.

This `README.md` provides a comprehensive guide to understand and use the project, from setup to code explanation. Adjust the concurrency limits or task count as needed for testing or other purposes.