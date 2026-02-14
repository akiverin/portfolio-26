import { configure } from 'mobx';

configure({
  useProxies: 'ifavailable',
  enforceActions: 'observed',
});
