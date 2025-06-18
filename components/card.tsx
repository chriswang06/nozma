'use client';

import React, { useState } from 'react';
import {ChevronDown, ChevronRight} from 'lucide-react';

const styles = {
    data: {
        null: "text-gray-500",
        boolean: "text-blue-600",
        number: "text-blue-600",
        string: "text-red-600",
        default: "text-gray-900"
    },
    layout: {
        expandableHeader: "cursor-pointer flex items-center py-0.5 select-none hover:bg-gray-50 rounded px-1 transition-colors duration-150",
        expandedContent: "border-l border-gray-200 ml-2 pl-3",   
        dataRow: "py-0.5 flex items-center",
        card: "font-sans text-sm leading-relaxed text-gray-900 bg-white p-5 rounded-md border border-gray-200 shadow-sm max-w-full overflow-auto",
        title: "text-2xl font-semibold mt-0 mb-5"
    },
    text: {
        key: "font-semibold",
        type: "text-gray-500",
        spacing: {
            afterIcon: "ml-1",
            afterKey: "ml-1.5",
            beforeValue: "mr-1.5"
        }
    }
};

interface CardProps {
    data: any;
    title?: string;
}

interface JsonProps {
    data: any;
    name?: string;
}

const JsonRenderer = ({ data, name }: JsonProps) => {
    const [isExpanded, setExpanded] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    }

    const renderData = (value: any) => {
        if (value === null) return <span className={styles.data.null}>null</span>;
        if (value === undefined) return <span className={styles.data.null}>undefined</span>;
        if (typeof value === 'boolean') return <span className={styles.data.boolean}>{value.toString()}</span>;
        if (typeof value === 'number') return <span className={styles.data.number}>{value}</span>;
        if (typeof value === 'string') {
            const displayValue = value.length > 100 ? value.substring(0, 100) + '...' : value;
            return <span className={styles.data.string}>"{displayValue}"</span>;
        }
        return <span className={styles.data.default}>{String(value)}</span>;
    };

    if (Array.isArray(data)) {
        return (
            <div>
                <div onClick={toggleExpanded} className = {styles.layout.expandableHeader} style={{ paddingLeft: 20 }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {name && <span className={`${styles.text.key} ${styles.text.spacing.afterIcon}`}>{name}:</span>}
                    <span className={`${styles.text.type} ${styles.text.spacing.afterKey}`}>
                        </span>
                </div>
                {isExpanded && (
                    <div className = {styles.layout.expandedContent}  style={{ marginLeft: 20}}>
                        {data.map((item, index) => (
                            <JsonRenderer key={index} data={item} name={`[${index}]`} />
                        ))}
                    </div>
                )}
            </div>
        );
    } else if (typeof data === 'object' && data !== null) {
        // when its another object
        return (
            <div>
                <div onClick={toggleExpanded} className = {styles.layout.expandableHeader} style={{ paddingLeft: 20 }}>
                    {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                    {name && <span className={`${styles.text.key} ${styles.text.spacing.afterIcon}`}>{name}:</span>}
                    <span className={`${styles.text.type} ${styles.text.spacing.afterKey}`}></span>
                    {!isExpanded && <span className={`${styles.text.type} ${styles.text.spacing.afterIcon}`}>...</span>}
                </div>
                {isExpanded ? (
                    <div className = {styles.layout.expandedContent} style={{ marginLeft: 20}}>
                        {Object.entries(data).map(([key, value]) => (
                            <JsonRenderer key={key} data={value} name={key} />
                        ))}
                    </div>
                ) : null}
            </div>
        );
    } else {
        return (
            <div className = {styles.layout.dataRow} style={{ paddingLeft: 20 }}>
                <span className={`${styles.text.key} ${styles.text.spacing.beforeValue}`}>{name}:</span>
                {renderData(data)}
            </div>
        );
    }
};

const Card = ({ data, title }: CardProps) => {
    return (
        <div className={styles.layout.card}>
            <div className={styles.layout.title}>{title}</div>
            <JsonRenderer data={data} name="RFP Information" />
        </div>
    );
};

export default Card;