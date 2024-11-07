const numberOfTasks = 20;
const taskList = [...Array(numberOfTasks)].map(() => 
    [...Array(~~(Math.random() * 10 + 3))]
        .map(() => String.fromCharCode(Math.random() * (123 - 97) + 97))
        .join('')
);

function doTask(taskName) {
    return new Promise((resolve) => {
        const begin = Date.now();
        setTimeout(() => {
            const end = Date.now();
            const timeSpent = (end - begin) + "ms";
            console.log(`\x1b[36m[TASK] FINISHED: ${taskName} in ${timeSpent}\x1b[0m`);
            resolve(true);
        }, Math.random() * 200);
    });
}

let maxConcurrency = getConcurrencyLimit(); // Initial concurrency level based on time

// Function to get concurrency level based on time of day
function getConcurrencyLimit() {
    const currentHour = new Date().getHours();
    return (currentHour >= 9 && currentHour < 17) ? 4 : 20; // Example limits for business hours vs. off-hours
}

// Function to update concurrency level dynamically
function monitorConcurrency() {
    setInterval(() => {
        const newConcurrency = getConcurrencyLimit();
        if (newConcurrency !== maxConcurrency) {
            console.log(`\x1b[33m[INFO] Concurrency level changed from ${maxConcurrency} to ${newConcurrency}\x1b[0m\n`);
            maxConcurrency = newConcurrency;
        }
    }, 5000); // Check every 5 seconds (or any desired interval)
}

async function manageConcurrency(taskList) {
    let activeTasks = 0;
    let taskIndex = 0;

    return new Promise((resolve) => {
        const processNextTask = () => {
            // If no tasks are left and all tasks are completed
            if (taskIndex >= taskList.length && activeTasks === 0) {
                resolve();
                return;
            }

            // Start new tasks while respecting the dynamic concurrency limit
            while (activeTasks < maxConcurrency && taskIndex < taskList.length) {
                const currentTask = taskList[taskIndex++];
                activeTasks++;
                console.log(`[EXEC] Task count: ${taskIndex} of ${taskList.length}`);
                console.log(`[EXEC] Starting: ${currentTask}`);
                console.log(`[EXEC] Concurrency: ${activeTasks} of ${maxConcurrency}\n`);
                doTask(currentTask)
                    .then(() => {
                        activeTasks--;
                        processNextTask(); // Process next task when current one is complete
                    });
            }
        };
        processNextTask();
    });
}

async function init() {
    console.log("[init] Concurrency Algo Testing...");
    console.log("[init] Tasks to process:", taskList.length);
    console.log("[init] Task list:", taskList.join(', '));
    console.log("[init] Initial Concurrency Level:", maxConcurrency, "\n");

    monitorConcurrency(); // Start monitoring concurrency changes
    await manageConcurrency(taskList);
    console.log("[init] All tasks completed!");
}

init();
