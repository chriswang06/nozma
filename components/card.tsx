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
        title: "text-2xl font-semibold mt-0 mb-5",
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
    searchTermKey?: string;
    searchTermValue?: string;
    expandAll?: boolean | null;
}

interface JsonProps {
    data: any;
    name?: string;
    searchTermKey?: string;
    searchTermValue?: string;
    expandAll?: boolean | null;
}

const JsonRenderer = ({ data, name, searchTermKey, searchTermValue, expandAll }: JsonProps) => {

    const matchesSearch = (str: string, searchTerm: string): boolean => {
        if (!searchTerm) return false;
        if (searchTerm.startsWith("/")) {
            try {
                const endPatternIndex = searchTerm.lastIndexOf("/");
                if (endPatternIndex > 0) {
                    const pattern = searchTerm.slice(1, endPatternIndex);
                    const flags = searchTerm.slice(endPatternIndex + 1);
                    const regex = new RegExp(pattern, flags);
                    return regex.test(str);
                }
            } catch (e) {
                return str.toLowerCase().includes(searchTerm.toLowerCase());
            }
        }
        return str.toLowerCase().includes(searchTerm.toLowerCase());

    };

    const containsSearchInKeys = (obj: any): boolean => {
        if (!searchTermKey) return false;
        const checkKeys = (o: any): boolean => {
            if (typeof o === "object" && o !== null) {
                return Object.keys(o).some(key =>
                    matchesSearch(key, searchTermKey) || checkKeys(o[key])
                );
            }
            return false;
        };
        return checkKeys(obj);
    }

    const containsSearchInValues = (obj: any): boolean => {
        if (!searchTermValue) return false;
        const checkValues = (o: any): boolean => {
            if (Array.isArray(o)) {
                return o.some(item => checkValues(item));
            } else if (typeof o === 'object' && o !== null) {
                return Object.values(o).some(value => checkValues(value));
            } else {
                return matchesSearch(String(o), searchTermValue);
            }
        };
        return checkValues(obj);
    }

    const containsSearch = (obj: any): boolean => {
        if (searchTermKey && searchTermValue) {
            return containsSearchInKeys(obj) && containsSearchInValues(obj);
        }
        return containsSearchInKeys(obj) || containsSearchInValues(obj);
    }
    const shouldExpand = (searchTermValue || searchTermKey) && containsSearch(data);
    const [isExpanded, setExpanded] = useState(shouldExpand);

    useEffect(() => {
        if (expandAll !== null) {
            setExpanded(expandAll);
        }
    }, [expandAll])

    useEffect(() => {
        if (expandAll === null) {
            setExpanded(containsSearch(data));
        }

    }, [searchTermKey, searchTermValue, data])

    const toggleExpanded = () => {
        setExpanded(!isExpanded);
    }

    const renderData = (value: any, isKey: boolean = false) => {

        const searchTerm = isKey ? searchTermKey : searchTermValue;

        if (value === null) return <span className={styles.data.null}>null</span>;
        if (value === undefined) return <span className={styles.data.null}>undefined</span>;

        const valueStr = String(value);
        const shouldHighlight = searchTerm && matchesSearch(valueStr, searchTerm);

        let className = styles.data.default;
        if (typeof value === 'boolean' || typeof value === 'string' || typeof value === "number") className = styles.data.string;

        return (
            <span className={shouldHighlight ? `${className} bg-yellow-400` : className}> {valueStr}</span>
        );

    }
    if (Array.isArray(data)) {
        return (
            <div>
                <div onClick={toggleExpanded} className={styles.layout.expandableHeader} style={{ paddingLeft: 20 }}>
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    {name && <span className={`${styles.text.key} ${styles.text.spacing.afterIcon}`}>{renderData(name, true)}:</span>}
                    <span className={`${styles.text.type} ${styles.text.spacing.afterKey}`}>
                    </span>
                </div>
                {isExpanded && (
                    <div className={styles.layout.expandedContent} style={{ marginLeft: 20 }}>
                        {data.map((item, index) => (
                            <JsonRenderer
                                key={index}
                                data={item}
                                name={`[${index}]`}
                                searchTermKey={searchTermKey}
                                searchTermValue={searchTermValue}
                                expandAll={expandAll} />
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
                    {name && <span className={`${styles.text.key} ${styles.text.spacing.afterIcon}`}>{renderData(name, true)}:</span>}
                    <span className={`${styles.text.type} ${styles.text.spacing.afterKey}`}></span>
                    {!isExpanded && <span className={`${styles.text.type} ${styles.text.spacing.afterIcon}`}>...</span>}
                </div>
                {isExpanded ? (
                    <div className={styles.layout.expandedContent} style={{ marginLeft: 20 }}>
                        {Object.entries(data).map(([key, value]) => (
                            <JsonRenderer
                                key={key}
                                data={value}
                                name={key}
                                searchTermKey={searchTermKey}
                                searchTermValue={searchTermValue}
                                expandAll={expandAll} />
                        ))}
                    </div>
                ) : null}
            </div>
        );
    } else {
        return (
            <div className={styles.layout.dataRow} style={{ marginLeft: 20 }}>
                <span className={`${styles.text.key} ${styles.text.spacing.beforeValue}`}>{renderData(name, true)}:</span>
                {renderData(data, false)}
            </div>
        );
    }
};

const Card = ({ data, title, searchTermKey, searchTermValue, expandAll }: CardProps) => {
    return (
        <div className={styles.layout.card}>
            <div className={styles.layout.title}>{title}</div>
            {/* {Object.entries(data).map(([key, value]) => (
                <JsonRenderer 
                key={key} 
                data = {value}
                name = {key}
                searchTerm={searchTerm} />
            ))} */}
            <JsonRenderer
                data={data}
                name={"File"}
                searchTermKey={searchTermKey}
                searchTermValue={searchTermValue}
                expandAll={expandAll} />

        </div>
    );
};

export default Card;