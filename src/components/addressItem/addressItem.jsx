export default function AddressItem({address}) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{address.state}</h5>
        <p className="card-text">{address.town}</p>
        <p className="card-text">{address.street + " " + address.number}</p>
        <p className="card-text">{address.complement}</p>
      </div>
    </div>
  )
};
