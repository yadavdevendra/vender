import { Button, Card } from '@cedcommerce/ounce-ui';
import React from 'react';
import { DI, DIProps } from '../../../../Core';

interface DisCardInterface extends DIProps {
    icon: JSX.Element,
    title: string,
    code: string,
    toAddbutton: boolean
}

const DisplayCard: (props: DisCardInterface) => JSX.Element = ({ icon, title, toAddbutton, di, code }) => {


    const handleConnect = () => {

        di.GET("connector/get/installationForm", { code: code }).then((e) => {
            if (e.data.post_type == 'redirect') {
                window.open(e.data.action);
            }
        });
    };

    return (
        <div>
            <Card title={title} cardType={"selego"}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {icon}
                </div>
                {toAddbutton && <Button thickness="thin" onClick={handleConnect}>Connect</Button>}
            </Card>
        </div>
    );
};

export default DI(DisplayCard);
