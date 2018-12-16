#!/usr/bin/env node
import gendiff from 'commander';
import { version } from '../../package.json';
import diff, { defaultRenderer, renderSelector } from '..';

const list = Object.keys(renderSelector).join('|');


gendiff
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', `Output format [${list}]`, [defaultRenderer])
  .action((firstConfig, secondConfig) => {
    try {
      if (!list.includes(gendiff.format)) {
        console.warn(`${gendiff.format} is not supported. Used default (${defaultRenderer})`);
      }
      const result = diff(firstConfig, secondConfig, gendiff.format);
      console.log(result);
    } catch (err) {
      const { errno, message } = err;
      console.error(message);
      process.exit(errno);
    }
  })
  .parse(process.argv);
