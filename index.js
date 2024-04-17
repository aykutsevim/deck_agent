const http = require('http');
const os = require('os');
const si = require('systeminformation');

async function getPerformanceData() {
    try {
        const [cpuTemperature, cpuLoad, memoryUsage, cpuCores] = await Promise.all([
            si.cpuTemperature(),
            si.currentLoad(),
            si.mem(),
            si.cpu()
        ]);

        return {
            cpuTemperature: cpuTemperature.main,
            cpuLoad: cpuLoad.currentload,
            memoryUsage: {
                total: memoryUsage.total,
                free: memoryUsage.free,
                used: memoryUsage.total - memoryUsage.free
            },
            cpuCores: cpuCores.cores
        };
    } catch (error) {
        console.error('Error fetching performance data:', error);
        return {
            error: 'Failed to fetch performance data'
        };
    }
}


const server = http.createServer(async (req, res) => {
    if (req.url === '/performance' && req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        const data = await getPerformanceData();
        res.end(JSON.stringify(data));
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
