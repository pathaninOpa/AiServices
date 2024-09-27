import { Button, Modal } from "react-bootstrap";

const CustomModal = ({show, setShow, onClose=null, closeText="Close",content, size = "lg", header = "Modal", noHeader = false}) => {
    const BodyContent = content;

    return (
        <>
        <Modal size={size} show={show} fullscreen={`md-down`} onHide={() => setShow(false)}>
            {noHeader === false && (<>
                <Modal.Header closeButton>
                    <Modal.Title>{header}</Modal.Title>
                </Modal.Header>
            </>)}
            <Modal.Body>
                <BodyContent />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
                <Button className="min-w-36" variant="dark" onClick={() => {
                    if (onClose === null) {
                        setShow(false);
                    } else {
                        onClose();
                        setShow(false);
                    }
                    }}>{closeText}</Button>
            </Modal.Footer>
        </Modal>
        </>
    )
};

export default CustomModal