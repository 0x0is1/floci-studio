import { dockerReq } from './src/services/dockerService';
import { ec2ExecService } from './src/services/ec2ExecService';

const res = await dockerReq('GET', '/containers/json');
console.log('Containers:', res.body?.map((c: any) => ({ name: c.Names, image: c.Image, ports: c.Ports, labels: c.Labels })));

const execRes = await ec2ExecService.execute({ port: 8080, command: 'cat /etc/os-release' });
console.log('Exec 8080 res:', execRes);

const exec8081 = await ec2ExecService.execute({ port: 8081, command: 'cat /etc/os-release' });
console.log('Exec 8081 res:', exec8081);
