export interface Target {
  name: string;
  ip: string;
  description: string;
}

export const predefinedTargets: Target[] = [
  {
    name: 'Cloudflare DNS',
    ip: '1.1.1.1',
    description: 'Cloudflare\'s primary DNS server'
  },
  {
    name: 'Google DNS',
    ip: '8.8.8.8',
    description: 'Google\'s primary DNS server'
  },
  {
    name: 'DFW',
    ip: '165.254.226.89',
    description: 'Dallas/Fort Worth Gateway'
  },
  {
    name: 'AWS US-East',
    ip: '52.216.227.10',
    description: 'Amazon US East (Virginia) Region'
  }
];