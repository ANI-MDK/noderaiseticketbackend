import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbItem from 'react-bootstrap/esm/BreadcrumbItem';

function BreadCrumb({items}) {
  return (
    <Breadcrumb>
    {
      items.map((item, index)=>(
        <BreadcrumbItem className="d-flex flex-row font-semibold text-base text-black space-x-4" key={index} href={item.href || '#'} active={item.active}>
          {item.label}
        </BreadcrumbItem>
      ))
    }
    </Breadcrumb>
  );
}

export default BreadCrumb;