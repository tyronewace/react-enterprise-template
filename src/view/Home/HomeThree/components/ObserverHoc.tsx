import React from 'react';
import {observer, useLocalObservable} from 'mobx-react-lite';
import {Button} from '@/components';
import {fetchPokemon} from '@/api';

const ObserverComponents = () => {
    /**
     * 关于 useLocalObservable
     * 1. useLocalObservable 是 mobx-react-lite 提供的一个钩子函数，用于在 React 函数组件中创建局部的 observable 对象。
     * 2. 可以使局部的状态更加清晰。
     * 3. 代码更加简洁，避免在顶层创建全局的 observable 对象，提高了组件的可维护性和可重用性。
     */
    const store = useLocalObservable(() => ({
        count: 0,
        loading: false,
        list: [],
        increment() {
            this.count++;
        },
        decrement() {
            this.count--;
        },
        async onFetchPokemon() {
            this.loading = true;
            const result: any = await fetchPokemon({limit: 100});
            const {results} = result;
            this.list = results;
            this.loading = false;
        },
        onChange(item: {name: string; url: string}) {
            // 点击某个条目时，修改该条目的 name，还记得 mobx 使用的是同一份数据吗，这里的更改能影响到列表的数据
            item.name = '我被修改了';
        }
    }));

    if (store.loading) {
        return <p>loading...</p>;
    }
    console.log('Observe组件');

    return (
        <div>
            <h3>点击获取数据, 打开控制台, 点击某一项查看console.log(渲染情况)</h3>
            <Button onClick={() => store.onFetchPokemon()}>获取数据observer</Button>
            <div>
                {store.list?.map((item: {name: string; url: string}) => {
                    console.log('render', item.name);
                    return (
                        <p key={item.url} onClick={() => store.onChange(item)}>
                            {item.name}
                        </p>
                    );
                })}
            </div>
        </div>
    );
};

export default observer(ObserverComponents);
