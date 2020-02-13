export default {
  parseTreeData(list, key, parentKey, nameKey) {

    //创建一个对象命名为map
    let map = {}
    //通过遍历把list中的元素放到map对象中
    list.forEach(item => {
      item.label = item[nameKey];
      if (!map[item[key]] && item[key]) {
        map[item[key]] = item
      }
    })
    //再次遍历为了对map属性所指的对象进行处理
    list.forEach(item => {
      //过滤父级
      if (item[parentKey] != "") {
        if (map[item[parentKey]] != undefined) {
          map[item[parentKey]].children ?
            map[item[parentKey]].children.push(item) :
            map[item[parentKey]].children = [item]
        }
      }
    })
    //过滤后仅剩下根节点
    return list.filter(item => {
      if (!item[parentKey]) {
        return item;
      }
    })
  },
  deepCopy(target) {
    if (typeof target !== 'object') return
    //判断目标类型，来创建返回值
    let newObj = target instanceof Array ? [] : {}
    for (let item in target) {
      //只复制自身的属性，不复制原型链上的
      if (target.hasOwnProperty(item)) {
        newObj[item] = typeof target[item] == 'object' ? this.deepCopy(target[item]) : target[item]
      }
    }
    return newObj
  },
  removeDuplicate(target) {
    let hash = {};
    const data = target.reduce((preVal, curVal) => {
      hash[curVal.StructureID] ? '' : hash[curVal.StructureID] = true && preVal.push(curVal);
      return preVal
    }, [])
    return data
  },
  flatten(arr) {
    return arr.reduce((result, item) => {
      return result.concat(Array.isArray(item.children) ? this.flatten(item.children) : item);
    }, []);
  },
  addParent(self, parentKey, noRepeatkey, map, level) {
    if (map && map[self[parentKey]] != undefined) {
      // map[item.ParentID].children ? map[item.ParentID].children.push(item) : map[item.ParentID].children = [item]
      if (level) {
        if (!self[level]) {
          map[self[parentKey]].addPrent = true
        } else if (self[level] == 2) {
          self.addChildren = true
        }

      }

      if (map[self[parentKey]].children) {
        if (map[self[parentKey]].children.filter(item => item[noRepeatkey] == self[noRepeatkey]).length == 0) {
          map[self[parentKey]].children.push(self)
        }

      } else {
        map[self[parentKey]].children = [self]
      }
    } else {
      console.log("map不存在或对应的值不存在")
    }

  },
  decDateStringCompare(property) {
    return function(a, b) {
      // var value1 = new Date(Date.parse(a[property].replace(/-/g, "/")));
      // var value2 = new Date(Date.parse(b[property].replace(/-/g, "/")));
      let value1 = new Date(a[property]).getTime();
      let value2 = new Date(b[property]).getTime();
      return value2 - value1; // value1-value2是从小到大    如果是从大到小 return value2 -value1
    }
  },
  getCurrentMonthFirst(){
    let date = new Date();
    date.setDate(1);
    let month = parseInt(date.getMonth() + 1);
    let day = date.getDate();
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day;
   
  },
  getCurrentMonthLast(){
    let date = new Date();
    let currentMonth = date.getMonth();
    let nextMonth = ++currentMonth;
    let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    let oneDay = 1000 * 60 * 60 * 24;
    let lastTime = new Date(nextMonthFirstDay - oneDay);
    let month = parseInt(lastTime.getMonth() + 1);
    let day = lastTime.getDate();
    if (month < 10) {
      month = '0' + month
    }
    if (day < 10) {
      day = '0' + day
    }
    return date.getFullYear() + '-' + month + '-' + day;
  
  }
  // removeChild(){

  // }
}