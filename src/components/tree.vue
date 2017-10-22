<script>
export default {
  name: "tree",
  components: {},
  data() {
    return {
      newNode: this.reBuildData(this.treeData)
    };
  },
  props: {
    treeData: Array,
    isMultiple: {
      type: Boolean,
      default: true
    },
    isAllOpen: {
      type: Boolean,
      default: false
    },
    isShowcheck: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    //数据重建方法
    reBuildData(arr) {
      var newArr = [];
      arr.forEach((ele, index) => {
        if (ele._parentId == null) {
          // 给父节点添加自定义属性 初始化只有根目录显示不打开子目录
          this.$set(ele, "isShow", true);
          this.$set(ele, "isChecked", false);
          this.$set(ele, "ishalfChecked", false);
          this.isAllOpen == true
            ? this.$set(ele, "isOpen", true)
            : this.$set(ele, "isOpen", false);
          this.$set(ele, "childNode", this.checkChildNode(ele.id, arr));
          newArr.push(ele);
        }
      }, this);

      return newArr;
    },
    //找出一个id下的所有子节点的方法 ，用于在递归遍历中
    checkChildNode(cId, arr) {
      let currentArr = [];
      arr.forEach(function(element, index) {
        if (element._parentId == cId) {
          //找到子元素后继续寻找子元素的子元素
          this.isAllOpen == true
            ? this.$set(element, "isOpen", true)
            : this.$set(element, "isOpen", false);
          this.$set(element, "isChecked", false);
          this.$set(element, "ishalfChecked", false);
          this.$set(element, "isShow", true);
          this.$set(element, "childNode", this.checkChildNode(element.id, arr));
          currentArr.push(element);
        }
      }, this);
      return currentArr;
    },

    createNode(h, item) {
      let This = this;
      if (item.isShow) {
        return h(
          "div",
          {
            class: {
              checkbox_con: true
            }
          },
          [
            h(
              "div",
              {
                class: {
                  msg_box: true
                }
              },
              [
                // 加入下拉箭头子元素
                h(
                  "span",
                  {
                    class: {
                      checkbox_arrow_box: true
                    }
                  },
                  [
                    (function() {
                      if (item.childNode.length) {
                        return h(
                          "i",
                          {
                            class: {
                              checkbox_arrow: true,
                              expanded: item.isOpen
                            },
                            domProps: {
                              linkData: item
                            },
                            on: {
                              click: function(event) {
                                This.show_down(event);
                              }
                            }
                          },
                          ""
                        );
                      }
                    })()
                  ]
                ),
                //增加选择框元素
                (function() {
                  if (This.isShowcheck == true) {
                    return h(
                      "i",
                      {
                        class: {
                          checkbox_inner: true,
                          checked_active: item.isChecked,
                          checked_half: item.ishalfChecked
                        },
                        domProps: {
                          linkData: item
                        },
                        on: {
                          click: function(event) {
                            This.checkedNode(event);
                          }
                        }
                      },
                      ""
                    );
                  } else {
                    if (item.childNode.length == 0) {
                      return h(
                        "i",
                        {
                          class: {
                            checkbox_inner: true,
                            checked_active: item.isChecked
                          },
                          domProps: {
                            linkData: item
                          },
                          on: {
                            click: function(event) {
                              This.checkedNode(event);
                            }
                          }
                        },
                        ""
                      );
                    }
                  }
                })(),
                //增加msg显示元素
                h(
                  "span",
                  {
                    class: {
                      checkbox_msg: true
                    },
                    domProps: {
                      linkData: item
                    },
                    on: {
                      click: function(event) {
                        This.pitchOneNode(event);
                      }
                    }
                  },
                  [item.name]
                )
              ]
            ),
            h(
              "div",
              {
                class: {
                  child_con: true,
                  active: item.isOpen
                }
              },
              (function() {
                let arr = [];
                if (item.childNode) {
                  //遍历 递归调用子类
                  item.childNode.map(function(element) {
                    arr.push(This.createNode(h, element));
                  }, this);
                }
                return arr;
              })()
            )
          ]
        );
      }
    },
    judgmentParentNode(cid, type) {
      //判断父级下面的子集是否都是关闭的 如果都关闭了 取消父级的选中
      if (cid != null) {
        //建一个变量等待缓存找出的node节点
        let currentNode = {};
        //循环整个数据找出id为cid的节点
        this.treeData.forEach(function(element) {
          if (element.id == cid) {
            currentNode = element;
          }
        }, this);
        //判断节点是否有子节点 有子节点的情况下判断 所有子节点是否都已经关闭
        if (currentNode.childNode.length) {
          //如果是选中 父级直接勾选 并且递归  如果是取消勾选 需判断父级是否所有子类都已经取消勾选
          if (type == true) {
            let currentNum = 0; //计数
            currentNode.childNode.forEach(function(element) {
              element.isChecked == type && currentNum++;
            }, this);
            if (currentNode.childNode.length == currentNum) {
              currentNode.isChecked = type;
              //如果是全部开启了，解除半选状态
              currentNode.ishalfChecked = false;
              //如果自己开启了 还得去检查父级是否开启了
              this.judgmentParentNode(currentNode._parentId, type);
            } else {
              //如果不是全部开启了 启动半选状态
              currentNode.ishalfChecked = true;
              //如果自己开启了 还得去检查父级是否开启了
              this.judgmentParentNode(currentNode._parentId, type);
            }
          } else {
            let currentNum = 0; //计数
            currentNode.childNode.forEach(function(element) {
              element.isChecked == type && currentNum++;
            }, this);
            if (currentNode.childNode.length == currentNum) {
              //去掉选择状态
              currentNode.isChecked = type;
              //如果全部关闭了 去掉半选状态
              currentNode.ishalfChecked = false;
              //如果自己关闭了 还得去检查父级是否关闭了
              this.judgmentParentNode(currentNode._parentId, type);
            } else {
              //如果不是全部被关闭了
              currentNode.ishalfChecked = true;
              this.judgmentParentNode(currentNode._parentId, type);
            }
          }
        }
      } else {
        return;
      }
    },
    recheckedchildNode() {
      let currentArr = [];
      this.treeData.forEach(function(element) {
        if (element.childNode.length == 0) {
          if (element.isChecked) {
            currentArr.push(JSON.parse(JSON.stringify(element)));
          }
        }
      }, this);
      return currentArr;
    },
    //取消所有节点
    cancelAllNodeChecked() {
      this.treeData.forEach(function(element) {
        element.isChecked = false;
      }, this);
    },
    checkedNode(eve) {
      let linkData = eve.srcElement.linkData;
      //解除半选状态
      linkData.ishalfChecked = false;
      if (this.isShowcheck == false && this.isMultiple == false) {
        let currentChecked = linkData.isChecked;
        //所有元素取消勾选
        this.cancelAllNodeChecked();
        //被点击元素变换状态
        linkData.isChecked = !currentChecked;
        //发送事件
        this.$emit("incheckednode", this.recheckedchildNode()[0]);
      } else {
        //多选情况
        //控制子元素同步
        this.findNodeAndSet(
          "isChecked",
          !linkData.isChecked,
          linkData.childNode
        );
        linkData.isChecked = !linkData.isChecked;
        // 判断父元素是否所有子节点都已经关闭或者开启 需递归
        this.judgmentParentNode(linkData._parentId, linkData.isChecked);
        //向外发送事件
        //筛选所有选中的子节点
        this.$emit("incheckednode", this.recheckedchildNode());
      }

      eve.stopPropagation();
    },
    //修改后的递归子节点赋值方法
    findNodeAndSet(key, value, arr) {
      arr.forEach(function(element) {
        element[key] = value;
        if (element.childNode.length) {
          this.findNodeAndSet(key, value, element.childNode);
        }
      }, this);
    },
    show_down(eve) {
      let linData = eve.srcElement.linkData;
      this.$emit(
        "inpulldown",
        JSON.parse(JSON.stringify(linData)),
        !linData.isOpen
      );
      linData.isOpen = !linData.isOpen;
      eve.stopPropagation();
    },
    pitchOneNode(eve) {
      let linkData = eve.srcElement.linkData;
      this.$emit("inselectnode", JSON.parse(JSON.stringify(linkData)));
    }
  },
  render: function(h) {
    let This = this;
    window.newNode = this.newNode;
    return h(
      "div",
      {
        class: {
          tree_con: true
        },
        attrs: {
          onselectstart: "javascript:return false;"
        }
      },
      this.newNode.map(item => {
        return This.createNode(h, item);
      })
    );
  }
};
</script>
<style>
.tree_con {
  width: 100%;
}

.checkbox_con {
  padding-left: 5px;
  width: 100%;
  text-align: left;
  line-height: 30px;
  overflow: hidden;
  font-size: 14px;
}

.msg_box {
  display: flex;
}

.checkbox_con .checkbox_inner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #cdcdcd;
  border-radius: 25%;
  vertical-align: middle;
  cursor: pointer;
  margin-top: 7px;
}

.checkbox_arrow_box {
  display: inline-block;
  width: 12px;
  margin-right: 5px;
  line-height: 28px;
}

.checkbox_con .checkbox_arrow {
  display: inline-block;
  width: 0px;
  height: 0px;
  border: 6px solid transparent;
  vertical-align: middle;
  cursor: pointer;
  border-right-width: 0;
  border-left-color: #97a8be;
  border-left-width: 7px;
  transform: rotate(0deg);
  transition: transform 0.3s ease-in-out;
}

.checkbox_con .checkbox_arrow.expanded {
  transform: rotate(90deg);
}

.checkbox_con .checkbox_msg {
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  cursor: pointer;
  flex: 1;
}

.checkbox_con .child_con {
  /* width: 94%; */
  height: 0;
  transition: height 0.3s ease-in-out;
  padding-left: 16px;
  padding-right: 6px;
}

.checkbox_con .child_con.active {
  height: auto;
}

.checkbox_con .checkbox_inner.checked_active {
  border: 2px solid #1a97db;
  border-radius: 25%;
}
.checkbox_con .checkbox_inner.checked_half {
  border: 2px solid #1a97db;
  border-radius: 25%;
}
.checkbox_con .checkbox_inner.checked_active:before {
  position: relative;
  top: 0px;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: "";
  font-weight: bold;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAMT0lEQVR4Xu3dXWxcRxUH8HPuOqBCir2W4J3Y2xbEA/BUIVUKJgXUUpG0CCEBERINjXcNiGdeeOK50Ow6pXxKIAqV6gJKAQECIQQPVRCVoIjdTRG8ISrv4hqqKPYdtEm8Xn/s3rlz586dM/PvY3xn5sz/nJ+u7TguE/5DAkhgagKMbJAAEpieAIBgOpDAjAQABOOBBAAEM4AEzBLAG8QsN6yKJAEAiaTRuKZZAgBilhtWRZIAgETSaFzTLAEAMcsNqyJJAEAiaTSuaZYAgJjlhlWRJAAgkTQa1zRLAEDMcsOqSBIAkEgajWuaJQAgZrlhVSQJAEgkjcY1zRIAELPcsCqSBAAkkkbjmmYJAIhZblgVSQIAEkmjcU2zBADELDesiiQBAImk0bimWQIAYpYbVkWSAIBE0mhc0ywBADHLDasiSQBAIml0aNecv9y9P9nls0R0LzPdQ0TbiuglRepXaVL7wdbFpZ6NOwOIjRSxh7ME5i9de1+SpE8y0dLMQ5V69saceuzVx+5+pUhxAFIkPax1msBCu/uphPlbuocqon/uUO39rzZP/U13zeHnAMQ0OaxzmsBCu3+eWX2biXLNrCL1Cqd8enOt8ReTgnMdZnIA1iCBogmY4tg7VxENOKX7TJAASNHuYX2pCRTFMYlEKbUybN31pzwFA0ietPCs0wRs4RgXrWhrh5IzW62lF3QvAiC6SeE5pwlYxzF+lajtHaqt6CIBEKdtx2E6CZSGYwIJUfKBzdby77PqAZCshPBxpwmUjmP/i5LXiPhMFhIAcdp+HDYrAWc4JpCkCT0wXG38ZlpdAIKZ9SIB5zhu31opuq4S+uA0JADixXjEXURVOPa/JKHraU099J+Ld/3icCcAJO7ZrPz2VePY/2xL3UgTevAwEgCpfETiLcAXHJNIiGrnBs2lK3t/BiDxzmelN1/s9B4loqcqLWLK4Yr4gUFz+aejDwOIjx0KvCbf3hxH4lZqO1Vz7xiunfoHgAQ+jL5dz3sc+9/d+vWg1VgBEN8mKOB6fP606rjYd9PkDIAEPJA+XU3Km2MyM6WoAyA+TVGgtSy2+xeI1dekXU+RehFApHVNWL0S3xzjiBVtAYiwgZNUrtQ3x2TGACJp4gTVKvrNsfedLFIvA4igoZNSagg4bmf9DIBImTohdYbwadVe1ErRJwBEyOBJKDOgNwcpRf3B3PLbAUTC5Amosb7eW2VFHQGlapWoVHLfoLX0OwDRigsPzUqg3uleZOL1UFJKmR8eri5vjO4DIKF0taJ7hPU1h9ohrp3Fj7tXNEyhHRs6DrxBQptYh/eJAQeAOByokI6KBQeAhDS1ju4SEw4AcTRUoRwTGw4ACWVyHdwjRhwA4mCwQjgiVhwAEsL0lnyHmHEASMnDJX372HEAiPQJLrF+4LgVLn7UpMQhk7o1cOx3DkCkTnFJdQPHwWABpKRBk7gtcBztGoBInOQSagaO40MFkBKGTdqWwDG9YwAibZot1wscswMFEMsDJ2k74MjuFoBkZxTkE8Ch11YA0cspqKeAQ7+dAKKfVRBPAke+NgJIvrxEPw0c+dtXCpCT7e7bEqqd3KI7/0qtt2znLwsrbCdQb/fXmNUTtvetar9UJY8MW0vPln2+NSD1Tq9Fih5hpvdOFq2I/syKN66/Lmn/98Kpf5V9Iex/NIF6u9dkpnYo2aTE54bN5edc3KcwkPn1/kqSqqeZ6c1ZBSuiLw6ajS9nPYeP20sguDdHSmeHa40f2Uto9k6FgNTX+x9jpb6fq1hF39hsNUb/C2D8V3ICeHMUD9gYyHy795GE6WkmquUtQyn63uDfy+fpS5zmXYvn9RLAF+R6OWU9ZQSkCI69goAkqzXmHwcO8+wOr8wNxAYOILHXwMM7AYfdbHMBsYkDSOw2crQbcNjPVBtIGTiAxF5DgcNelpM7aQEpE8cBJM3lTxKzKueq4e4KHOX1NhOICxzj6yn65mZz+VEg0W84cOhnZfLkTCBOcYxfJUCi20jg0E3K/LmpQCrBASTanQQO7agKPXgskEpxAElmQ4EjMyJrDxwB4gUOIJnaYOCwNvtaGx0A4hUOIDnSQODQmmmrD42B1Nu9h5jpx1Z3t7UZfsCRRv+cgIku2Yq06n1Sxz+Va3rfm0DufPLv95zYufECMZ803aj0dRF/CxhvjtKna+oBN4HUO70/MtG7qitD8+QIkQCH5myU9BgvXOp9OEnIyb/OsnGHlOjrw2bjgo29fN8Dn1ZV3yGut3vfZaaPV19KjgoieJPgzZFjHkp8lOvt7svM/NYSzyhla6XoqUGr8ZlSNq9404VO/7MJqa9WXIa146V8QX7chXmx3fsfMd1hLQ2XGwX4JsGbw+UAZZ/Fi+3uNjG/MftRT58ICAlw+DdjvNjpdYmo4V9p+hUpovVBs9HUX+Hfkwvr3c8lir/iX2VmFaXMDw9XlzfMVvuzavRF+neY6bw/JZlVIhlJSL+aRym1Q1w7O2guXTHrpF+rxH2bd1Z8EpEstLufT5gf92sszKuR/AX5sV+kj/6w3u5dZaZ3m8fiz0pJSPDm8GduplWy/6MmuztXiegN/pecXaEEJMCR3Ucfnhj/sKK0v1HPCk8p6gxajVbWc1V8HJ9WVZG62ZkHftx9Yb1/jpV6xuS3JZodX+4qH98keHOU23Pbux/5B1M3kaTpD5l5zvZhVeznExLgqGICip157D+5rXeuPUhq9zkgKRbu5GrgsJely52m/tIGILHXBuCwl6XrnWb+2h8gKd4O4CieYZU7ZP7iOCAxbw9wmGfny8pMIKNCgSR/u4Ajf2Y+rtACAiT5Wgcc+fLy+WltIECi10bg0MtJylO5gADJ7LYCh5Sx168zN5AQkRDR45vNxhf0Yzv6JHAUSc/ftUZAgORgQ4HD3wEvWpkxECC5FT1wFB1Bv9cXAhI7EuDwe7htVFcYSKxIgMPG+Pm/hxUgsSEBDv8H21aF1oDEggQ4bI2ejH2sAhkjod0NJj4hI4LMKsffAgaOzKyCe8A6kFFC85e79ycpXQkJiVJ8jVk9EcoEKEo+FMqv5imzJ6UACRRJmX1wtndov7eq7OBKAwIkZbcu//7AkT+zUoEASf6GlLUCOMySLR0IkJg1xuYq4DBP0wkQIDFvUNGVwFEsQWdAgKRYo0xWA4dJagfXOAUCJMUbprsDcOgmNfs550CAxE7jZu0CHPYyrgQIkNhr4OGdgMNutpUBARK7jRztBhz2M60UCJDYayhw2MtycqfKgQBJ8cYCR/EMp+3gBRAgMW8wcJhnp7PSGyBAotOug88AR/7M8q7wCgiQ6LcPOPSzKvKkd0DGSHb5J8z0+iKXC3UtcLjrrJdARtdfWO+d5pR+BiT4tModh6MneQsESI42C28O91S8BgIk+wMBHO5xjE70HgiQ4G/Iq6Fx61QRQGJGgjdHlTwEAYkRCXBUi0PUG2Qvqli+uwUc1eMQCSSGNwlw+IFDLJCQkQCHPzhEAwkRCXD4hUM8kJCQAId/OIIAEgIS4PATRzBAJCMBDn9xBAVEIhLg8BtHcEAkIQEO/3EECWQPSZLS88R0h49tAA4fu3J8TWJ+FitvpIvt/nuI1C99QwIceTtZ7fPBAhnF6hsS4Kh22E1ODxqIT0iAw2Q8q18TPBAfkABH9YNuWkEUQKpEAhymo+nHumiAVIEEOPwY8iJVRAXEJRLgKDKW/qyNDogLJMDhz4AXrSRKIGUiAY6iI+nX+miBlIEEOPwabhvVRA3EJhLgsDGO/u0RPRAbSIDDv8G2VRGA3E7S9MdSgMPWKPq5D4BM9GWx07tXET3PRHWtdil6jRI6t7na+LnW83hIXAIAcqhlb7p8rTGXppeJaCWjm1fTpPbp4cVTL4rrOgrWTgBApkS10O6+k5k/SopOE6u7megEKXpJMf2WU97YXGv8QTtlPCg2AQAR2zoU7iIBAHGRMs4QmwCAiG0dCneRAIC4SBlniE0AQMS2DoW7SABAXKSMM8QmACBiW4fCXSQAIC5SxhliEwAQsa1D4S4SABAXKeMMsQkAiNjWoXAXCQCIi5RxhtgEAERs61C4iwQAxEXKOENsAgAitnUo3EUCAOIiZZwhNgEAEds6FO4iAQBxkTLOEJsAgIhtHQp3kQCAuEgZZ4hNAEDEtg6Fu0gAQFykjDPEJgAgYluHwl0kACAuUsYZYhMAELGtQ+EuEgAQFynjDLEJ/B+QD9xGpJzQKAAAAABJRU5ErkJggg==");
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% auto;
}
.checkbox_con .checkbox_inner.checked_half:before {
  position: relative;
  top: 0px;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  content: "";
  font-weight: bold;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAACXBIWXMAAAsTAAALEwEAmpwYAAA4KmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNy0xMC0xMVQwMDowNzoyNSswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE3LTEwLTIxVDIxOjIyOjM0KzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcDpNZXRhZGF0YURhdGU+MjAxNy0xMC0yMVQyMToyMjozNCswODowMDwveG1wOk1ldGFkYXRhRGF0ZT4KICAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9wbmc8L2RjOmZvcm1hdD4KICAgICAgICAgPHBob3Rvc2hvcDpDb2xvck1vZGU+MzwvcGhvdG9zaG9wOkNvbG9yTW9kZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDo4NGY0ZTkwNy03ZTAxLTRhZmEtOWEzNS1hZDg2ODI0ZjY1NDE8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPnhtcC5kaWQ6ODRmNGU5MDctN2UwMS00YWZhLTlhMzUtYWQ4NjgyNGY2NTQxPC94bXBNTTpEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06T3JpZ2luYWxEb2N1bWVudElEPnhtcC5kaWQ6ODRmNGU5MDctN2UwMS00YWZhLTlhMzUtYWQ4NjgyNGY2NTQxPC94bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpIaXN0b3J5PgogICAgICAgICAgICA8cmRmOlNlcT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+Y3JlYXRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjg0ZjRlOTA3LTdlMDEtNGFmYS05YTM1LWFkODY4MjRmNjU0MTwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNy0xMC0xMVQwMDowNzoyNSswODowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICA8L3JkZjpTZXE+CiAgICAgICAgIDwveG1wTU06SGlzdG9yeT4KICAgICAgICAgPHRpZmY6T3JpZW50YXRpb24+MTwvdGlmZjpPcmllbnRhdGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzIwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjIwMDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMDA8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAg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");
  background-size: 100% auto;
  background-position: center;
  background-repeat: no-repeat;
}
</style>


