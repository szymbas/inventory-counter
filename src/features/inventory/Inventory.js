import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addItem,
    removeItem,
    incrementItemNumber,
    decrementItemNumber,
    selectItems
} from './inventorySlice';
import styles from './Inventory.module.css';

export function Inventory() {
    const items = useSelector(selectItems);
    const dispatch = useDispatch();
    const [newItemVisible, setNewItemVisible] = useState(items.length === 0);
    const [newItemName, setNewItemName] = useState('');
    const [newItemTargetCount, setNewItemTargetCount] = useState('');
    const itemsRef = useRef([]);

    useEffect(() => {
        focusFirstItem();
    }, []);

    const itemKeyListener = (event, index) => {
        switch (event.key) {
            case 'ArrowDown': {
                const nextItemIndex = index + 1 < items.length ? index + 1 : 0;
                const nextItem = itemsRef.current[nextItemIndex];
                nextItem.focus();
                break;
            }
            case 'ArrowUp': {
                const prevItemIndex = index > 0 ? index - 1 : items.length - 1;
                const prevItem = itemsRef.current[prevItemIndex];
                prevItem.focus();
                break;
            }
            case '+':
                dispatch(incrementItemNumber({ index, incrementBy: 1 }));
                break;
            case '-':
                dispatch(decrementItemNumber({ index, decrementBy: 1 }));
                break;
            case '=':
                dispatch(incrementItemNumber({ index, incrementBy: 64 }));
                break;
            case '_':
                dispatch(decrementItemNumber({ index, decrementBy: 64 }));
                break;
            default:
                return;
        }
    };

    const focusFirstItem = () => {
        if (items.length > 0) {
            itemsRef.current[0].focus();
        }
    };

    return (
        <section>
            {items.length > 0
                ? (
                    <table className={styles.inventoryItems}>
                        <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Zebrane</th>
                                <th>Zostało</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const countRest = item.targetCount - item.count;
                                return (
                                    <tr
                                        key={`inventory-item-${index}`}
                                        ref={ref => { itemsRef.current[index] = ref; }}
                                        tabIndex={0}
                                        className={styles.inventoryItem}
                                        onKeyDown={(event) => itemKeyListener(event, index)}
                                    >
                                        <td>{item.name}</td>
                                        <td>
                                            {`(${Math.round(item.count/64 * 100) / 100}) `}
                                            <strong>{item.count}/{item.targetCount}</strong>
                                            {` (${Math.round(item.targetCount/64 * 100) / 100})`}
                                        </td>
                                        <td>
                                            <strong>{countRest}</strong>
                                            {` (${Math.round(countRest/64 * 100) / 100})`}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                tabIndex={-1}
                                                className={styles.button}
                                                onClick={() => dispatch(removeItem(index))}
                                            >
                                                X
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )
                : null
            }
            {newItemVisible
                ? (
                    <form
                        className={styles.form}
                        onSubmit={(event) => {
                            event.preventDefault();
                            dispatch(addItem({
                                newItemName,
                                newItemTargetCount
                            }));
                            setNewItemVisible(false);
                            setNewItemName('');
                            setNewItemTargetCount('');
                            focusFirstItem();
                        }}
                    >
                        <div className={styles.addForm}>
                            <label htmlFor="new-item-name" className={styles.label}>Nazwa:</label>
                            <input
                                type="text"
                                id="new-item-name"
                                className={styles.textfield}
                                value={newItemName}
                                onInput={(event) => {setNewItemName(event.target.value)}}
                            />
                            <label htmlFor="new-item-target-number" className={styles.label}>Do zebrania:</label>
                            <input
                                type="number"
                                id="new-item-target-number"
                                className={styles.textfield}
                                value={newItemTargetCount}
                                onInput={(event) => {setNewItemTargetCount(event.target.value)}}
                            />
                            <button
                                type="button"
                                className={styles.button}
                                onClick={(event) => {
                                    setNewItemVisible(false);
                                    focusFirstItem();
                                }}
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                className={styles.button}
                            >
                                Zapisz
                            </button>
                        </div>
                    </form>
                )
                : (
                    <button
                        className={styles.button}
                        aria-label="Dodaj"
                        onClick={() => setNewItemVisible(true)}
                    >
                        Dodaj
                    </button>
                )
            }
        </section>
    );
}
