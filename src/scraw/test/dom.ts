import { JSDOM } from 'jsdom';
import axios from 'axios';

const t = Date.now();

function main() {
  Promise.all([
    // getTag(),
    // getTag(),
    // getTag(),
    // getTag(),
    getTag()
  ]).then(() => {
  });
}

main();

function getTag() {
  return new Promise(resolve => {
    const url = 'https://gy.lianjia.com/ershoufang/qingzhenshi/pg4/';
    axios.get(url).then(res => {
      const dom = new JSDOM(`${res.data}`);
      dom.window.onload = function(res) {
        const tagt = dom.window.document.querySelectorAll('.sellListContent');
        const tag = dom.window.document.querySelectorAll('.sellListContent li');
        debugger;

        const fs = Array.from(tag).map((li: HTMLLIElement) => {
          const [xiaoqu, community] = Array.from(
            li.querySelectorAll('.positionInfo a')
          ) as HTMLLinkElement[];
          let k = {
            houseDetailId:
              (li?.dataset['lj_action_housedel_id'] as string) || '',
            community: community?.textContent || '',
            communityLink: community?.href || ''
          };
          return k;
        });
        resolve();
      };
    });
  });
}
