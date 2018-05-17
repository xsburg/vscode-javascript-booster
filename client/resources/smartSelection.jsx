import React from 'react';
import * as navigation from 'modules/navigation';

class Table extends React.Component {
    doSmartThings() {
        const company = state.entities.companies[companyId];
        const displayName = `${company.name} - created ${company.creationDate}`;
        const sentence = 'All your base are belong to us';
    }

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
