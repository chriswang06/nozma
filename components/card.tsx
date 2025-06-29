'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const styles = {
    data: {
        null: "text-gray-500",
        boolean: "text-blue-600",
        number: "text-red-600",
        string: "text-white-600",
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
    searchTerm?: string;
}

interface JsonProps {
    data: any;
    name?: string;
    searchTerm?: string;
    path?: string;
}

const JsonRenderer = ({ data, name, searchTerm = '', path = '' }: JsonProps) => {

    const currentPath = path ? '${path}.${name}' : name || '';

    const containsSearchTerm = (obj: any): boolean => {
        if (!searchTerm) return false;
        return JSON.stringify(obj).toLowerCase().includes(searchTerm.toLowerCase());
    }
    const shouldExpand = searchTerm && containsSearchTerm(data);
    const [isExpanded, setExpanded] = useState(shouldExpand);

    useEffect(() => {
        if (!searchTerm) {
            setExpanded(false);
        }
        else {
            setExpanded(containsSearchTerm(data));
        }
    }, [searchTerm, data])

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    }

    const renderData = (value: any) => {
        if (value === null) return <span className={styles.data.null}>null</span>;
        if (value === undefined) return <span className={styles.data.null}>undefined</span>;
        if (typeof value === 'boolean') {
            const displayValue = value;
            if (searchTerm && value.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                return <span className={`${styles.data.boolean} bg-yellow-200`}>{displayValue.toString()}</span>;
            }
            return <span className={styles.data.boolean}>{displayValue.toString()}</span>
        }
        if (typeof value === 'number') {
            const displayValue = value;
            if (searchTerm && value.toString().toLowerCase().includes(searchTerm.toLowerCase())) {
                return <span className={`${styles.data.number} bg-yellow-200`}>{displayValue.toString()}</span>;
            }
            return <span className={styles.data.number}>{displayValue.toString()}</span>
        }
        if (typeof value === 'string') {
            const displayValue = value;
            if (searchTerm && value.toLowerCase().includes(searchTerm.toLowerCase())) {
                return <span className={`${styles.data.string} bg-yellow-200`}>{displayValue}</span>;
            }
            return <span className={styles.data.string}>"{displayValue}"</span>;
        }
        return <span className={styles.data.default}>{String(value)}</span>;
    };

    if (Array.isArray(data)) {
        return (
            <div>
                <div onClick={toggleExpanded} className={styles.layout.expandableHeader} style={{ paddingLeft: 20 }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {name && <span className={`${styles.text.key} ${styles.text.spacing.afterIcon}`}>{name}:</span>}
                    <span className={`${styles.text.type} ${styles.text.spacing.afterKey}`}>
                    </span>
                </div>
                {isExpanded && (
                    <div className={styles.layout.expandedContent} style={{ marginLeft: 20 }}>
                        {data.map((item, index) => (
                            <JsonRenderer key={index} data={item} name={`[${index}]`} searchTerm={searchTerm} path={currentPath} />
                        ))}
                    </div>
                )}
            </div>
        );
    } else if (typeof data === 'object' && data !== null) {
        return (
            <div>
                <div onClick={toggleExpanded} className={styles.layout.expandableHeader} style={{ paddingLeft: 20 }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {name && <span className={`${styles.text.key} ${styles.text.spacing.afterIcon}`}>{name}:</span>}
                    <span className={`${styles.text.type} ${styles.text.spacing.afterKey}`}></span>
                    {!isExpanded && <span className={`${styles.text.type} ${styles.text.spacing.afterIcon}`}>...</span>}
                </div>
                {isExpanded ? (
                    <div className={styles.layout.expandedContent} style={{ marginLeft: 20 }}>
                        {Object.entries(data).map(([key, value]) => (
                            <JsonRenderer key={key} data={value} name={key} searchTerm={searchTerm} path={currentPath} />
                        ))}
                    </div>
                ) : null}
            </div>
        );
    } else {
        const keyHighlight = searchTerm && name && name.toLowerCase().includes(searchTerm.toLowerCase());

        return (
            <div className={styles.layout.dataRow} style={{ marginLeft: 20 }}>
                <span className={`${styles.text.key} ${styles.text.spacing.beforeValue}`}>{name}:</span>
                {renderData(data)}
            </div>
        );
    }
};

const Card = ({ data, title, searchTerm }: CardProps) => {
    return (
        <div className={styles.layout.card}>
            <div className={styles.layout.title}>{title}</div>
            {Object.entries(data).map(([key, value]) => (
                <JsonRenderer 
                key={key} 
                data = {value}
                name = {key}
                searchTerm={searchTerm} />
            ))}

        </div>
    );
};

export default Card;