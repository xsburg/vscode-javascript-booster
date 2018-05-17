import React from 'react';

class Table extends React.Component {
    render() {
        const { columns, celsius } = this.props;

        let className = 'table',
            limit = 100;

        const columnElements = columns.map(col => <div className="column">col.name</div>);

        let warningElement;
        if (celsius >= limit) {
            warningElement = <div class="warn">WARNING</div>;
        } else {
            warningElement = <div class="warn" />;
        }

        return (
            <div className={className}>
                <div>{this.getBoilingVerdict()}</div>
                <div className="header">{columnElements}</div>
            </div>
        );
    }
}
