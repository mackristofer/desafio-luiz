import { AxiosRequestConfig } from 'axios';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Employee } from 'types/employee';
import { SpringPage } from 'types/vendor/spring';
import { hasAnyRoles } from 'util/auth';
import { requestBackend } from 'util/requests';
import EmployeeCard from 'components/EmployeeCard';
import './styles.css';
import Pagination from 'components/Pagination';

type ControlComponentsData = {
  activePage: number;
};

const List = () => {
  const [page, setPage] = useState<SpringPage<Employee>>();

  const [controlComponentsData, setControlComponentsData] =
    useState<ControlComponentsData>({
      activePage: 0
    });

  const handlePageChange = (pageNumber: number) => {
    setControlComponentsData({ activePage: pageNumber });
  };

  const getEmployees = useCallback(() => {
    const config: AxiosRequestConfig = {
      method: 'GET',
      url: '/employees',
      params: {
        page: controlComponentsData.activePage,
        size: 4,
      },
      withCredentials: true
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });
  }, [controlComponentsData]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <>
      {hasAnyRoles(['ROLE_ADMIN']) ? (
        <Link to="/admin/employees/create">
          <button className="btn btn-primary text-white btn-crud-add">
            ADICIONAR
          </button>
        </Link>
      ) : (<h1>Não tem</h1>)}

      {page?.content.map((employee) => (
        <EmployeeCard key={employee.id} employee={employee} />
      ))}

      <Pagination
        forcePage={page?.number}
        pageCount={page ? page.totalPages : 0}
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
