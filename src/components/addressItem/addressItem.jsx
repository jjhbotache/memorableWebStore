import SimpleDataControlBtns from "../simpleDataControlBtns/SimpleDataControlBtns";

export default function AddressItem({address,onEdit,onDelete}) {
  
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="card-title">{address.name}</h2>
        <hr className="w-100 mx-0" />
        <h5 className="card-text">{ address.state+" - "+address.town}</h5>
        <p className="card-text">Street:{address.street + " - #" + address.number}</p>
        { (onEdit && onDelete) && <SimpleDataControlBtns onEdit={onEdit} onDelete={onDelete} />}
      </div>
    </div>
  )
};
