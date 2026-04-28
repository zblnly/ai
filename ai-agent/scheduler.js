require('dotenv').config();
const { AIContentAgent } = require('./agent');

async function main() {
    console.log('🔄 AI内容Agent - 自动化运行脚本\n');
    
    const agent = new AIContentAgent({
        websitePath: process.env.WEBSITE_PATH || '../ai'
    });
    
    await agent.initialize();
    
    // 解析命令行参数
    const args = process.argv.slice(2);
    const mode = args[0] || 'once';
    
    switch (mode) {
        case 'once':
            console.log('📌 模式: 单次运行');
            await agent.run();
            break;
            
        case 'continuous':
        case 'watch':
            console.log('📌 模式: 持续监控');
            await agent.run();
            
            // 每小时检查一次
            setInterval(async () => {
                console.log('\n⏰ 执行例行检查...');
                await agent.run();
            }, 60 * 60 * 1000);
            break;
            
        case 'schedule':
            console.log('📌 模式: 定时调度');
            const cronExpression = args[1] || '0 */6 * * *';
            console.log(`⏰ Cron表达式: ${cronExpression}`);
            
            const schedule = require('node-schedule');
            schedule.scheduleJob(cronExpression, async () => {
                console.log('\n⏰ 定时任务执行');
                await agent.run();
            });
            
            console.log('✅ 定时任务已设置，等待执行...');
            break;
            
        default:
            console.log('❓ 未知模式:', mode);
            console.log('\n用法:');
            console.log('  node scheduler.js once        - 单次运行');
            console.log('  node scheduler.js continuous   - 持续运行');
            console.log('  node scheduler.js schedule    - 定时运行(默认每6小时)');
            console.log('  node scheduler.js schedule "0 */3 * * *" - 自定义Cron表达式');
    }
}

main().catch(err => {
    console.error('❌ 脚本执行失败:', err);
    process.exit(1);
});
